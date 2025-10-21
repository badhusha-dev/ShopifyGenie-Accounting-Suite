import { Request, Response } from 'express';
import { shopifyService } from '../services/shopifyService';
import { logger } from '../utils/logger';
import { prisma } from '../config/database';

export const install = async (req: Request, res: Response) => {
  try {
    const { shop } = req.query;

    if (!shop || typeof shop !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Shop parameter is required',
      });
    }

    // Validate shop domain format
    const shopDomain = shop.replace(/\.myshopify\.com$/, '');
    const authUrl = shopifyService.generateAuthUrl(shopDomain);

    logger.info(`Generated auth URL for shop: ${shopDomain}`);

    res.json({
      success: true,
      data: {
        authUrl,
        shop: shopDomain,
      },
    });
  } catch (error) {
    logger.error('Install error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate installation URL',
    });
  }
};

export const callback = async (req: Request, res: Response) => {
  try {
    const { code, shop, state } = req.query;

    if (!code || !shop || typeof code !== 'string' || typeof shop !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
      });
    }

    // Exchange code for access token
    const accessToken = await shopifyService.exchangeCodeForToken(shop, code);

    // Store shop information
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    await shopifyService.storeShop(shop, accessToken, userId);

    // Initialize chart of accounts if not already done
    await shopifyService.initializeChartOfAccounts();

    logger.info(`Shopify app installed for shop: ${shop}`);

    res.json({
      success: true,
      message: 'Shopify app installed successfully',
      data: {
        shop,
        installed: true,
      },
    });
  } catch (error) {
    logger.error('Callback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete installation',
    });
  }
};

export const sync = async (req: Request, res: Response) => {
  try {
    const { shop } = req.body;

    if (!shop) {
      return res.status(400).json({
        success: false,
        error: 'Shop parameter is required',
      });
    }

    // Check if shop exists and user has access
    const store = await prisma.shopifyStore.findUnique({
      where: { shopDomain: shop },
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Shop not found',
      });
    }

    // Perform sync
    await shopifyService.syncOrders(shop);

    res.json({
      success: true,
      message: 'Sync completed successfully',
      data: {
        shop,
        syncedAt: new Date(),
      },
    });
  } catch (error) {
    logger.error('Sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Sync failed',
    });
  }
};

export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await prisma.shopifyStore.findMany({
      where: { isActive: true },
      select: {
        id: true,
        shopDomain: true,
        scope: true,
        isActive: true,
        lastSyncAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: stores,
    });
  } catch (error) {
    logger.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get stores',
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { shop, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (shop) {
      const store = await prisma.shopifyStore.findUnique({
        where: { shopDomain: shop as string },
      });
      if (store) {
        where.storeId = store.id;
      }
    }

    const [orders, total] = await Promise.all([
      prisma.shopifyOrder.findMany({
        where,
        include: {
          store: {
            select: {
              shopDomain: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: Number(limit),
      }),
      prisma.shopifyOrder.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get orders',
    });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.shopifyOrder.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            shopDomain: true,
          },
        },
        journalEntries: {
          include: {
            lines: {
              include: {
                account: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    logger.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get order details',
    });
  }
};

// Webhook handlers
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-shopify-hmac-sha256'] as string;
    const topic = req.headers['x-shopify-topic'] as string;
    const shop = req.headers['x-shopify-shop-domain'] as string;

    if (!signature || !topic || !shop) {
      return res.status(400).json({
        success: false,
        error: 'Missing webhook headers',
      });
    }

    // Verify webhook signature
    const body = JSON.stringify(req.body);
    if (!shopifyService.verifyWebhook(body, signature)) {
      logger.warn(`Invalid webhook signature for shop: ${shop}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid webhook signature',
      });
    }

    // Store webhook event
    await prisma.webhookEvent.create({
      data: {
        topic,
        shopDomain: shop,
        data: req.body,
        processed: false,
      },
    });

    // Process webhook based on topic
    switch (topic) {
      case 'orders/paid':
        await handleOrderPaid(req.body, shop);
        break;
      case 'orders/fulfilled':
        await handleOrderFulfilled(req.body, shop);
        break;
      case 'refunds/create':
        await handleRefundCreated(req.body, shop);
        break;
      default:
        logger.info(`Unhandled webhook topic: ${topic}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Webhook processing failed',
    });
  }
};

// Webhook event handlers
const handleOrderPaid = async (orderData: any, shop: string) => {
  try {
    logger.info(`Processing order paid webhook for shop: ${shop}`);
    // Implementation for order paid webhook
  } catch (error) {
    logger.error('Error handling order paid webhook:', error);
  }
};

const handleOrderFulfilled = async (orderData: any, shop: string) => {
  try {
    logger.info(`Processing order fulfilled webhook for shop: ${shop}`);
    // Implementation for order fulfilled webhook
  } catch (error) {
    logger.error('Error handling order fulfilled webhook:', error);
  }
};

const handleRefundCreated = async (refundData: any, shop: string) => {
  try {
    logger.info(`Processing refund created webhook for shop: ${shop}`);
    // Implementation for refund created webhook
  } catch (error) {
    logger.error('Error handling refund created webhook:', error);
  }
};
