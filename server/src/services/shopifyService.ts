import Shopify from 'shopify-api-node';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { DEFAULT_ACCOUNTS, POSTING_RULES } from '@shopifygenie/shared';

export class ShopifyService {
  private apiKey: string;
  private apiSecret: string;
  private scopes: string[];
  private webhookSecret: string;

  constructor() {
    this.apiKey = process.env.SHOPIFY_API_KEY || '';
    this.apiSecret = process.env.SHOPIFY_API_SECRET || '';
    this.scopes = (process.env.SHOPIFY_SCOPES || '').split(',');
    this.webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET || '';

    if (!this.apiKey || !this.apiSecret) {
      logger.warn('Shopify API credentials not configured. Shopify integration will be disabled.');
    }
  }

  // Generate OAuth URL for app installation
  generateAuthUrl(shop: string, state?: string): string {
    const nonce = crypto.randomBytes(16).toString('hex');
    const redirectUri = `${process.env.CLIENT_URL}/api/shopify/callback`;
    
    const params = new URLSearchParams({
      client_id: this.apiKey,
      scope: this.scopes.join(','),
      redirect_uri: redirectUri,
      state: state || nonce,
    });

    return `https://${shop}.myshopify.com/admin/oauth/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(shop: string, code: string): Promise<string> {
    try {
      const response = await fetch(`https://${shop}.myshopify.com/admin/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.apiKey,
          client_secret: this.apiSecret,
          code,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to exchange code for token: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return data.access_token;
    } catch (error) {
      logger.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  // Create Shopify API client for a specific shop
  createClient(shop: string, accessToken: string): Shopify {
    return new Shopify({
      shopName: shop,
      accessToken,
      apiVersion: '2025-01',
    });
  }

  // Verify webhook HMAC
  verifyWebhook(data: string, signature: string): boolean {
    const hmac = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(data, 'utf8')
      .digest('base64');

    return hmac === signature;
  }

  // Store shop information in database
  async storeShop(shopDomain: string, accessToken: string, userId: string): Promise<void> {
    try {
      // Encrypt access token
      const encryptedToken = this.encryptToken(accessToken);

      await prisma.shopifyStore.upsert({
        where: { shopDomain },
        update: {
          accessToken: encryptedToken,
          scope: this.scopes.join(','),
          isActive: true,
          updatedAt: new Date(),
        },
        create: {
          shopDomain,
          accessToken: encryptedToken,
          scope: this.scopes.join(','),
          isActive: true,
          createdById: userId,
        },
      });

      logger.info(`Shop stored: ${shopDomain}`);
    } catch (error) {
      logger.error('Error storing shop:', error);
      throw error;
    }
  }

  // Sync orders from Shopify
  async syncOrders(shopDomain: string): Promise<void> {
    try {
      const store = await prisma.shopifyStore.findUnique({
        where: { shopDomain },
      });

      if (!store) {
        throw new Error('Shop not found');
      }

      const accessToken = this.decryptToken(store.accessToken);
      const shopify = this.createClient(shopDomain, accessToken);

      // Get orders from Shopify
      const orders = await shopify.order.list({
        limit: 250,
        status: 'any',
        financial_status: 'paid',
      });

      for (const order of orders) {
        await this.processOrder(order, store.id);
      }

      // Update last sync time
      await prisma.shopifyStore.update({
        where: { id: store.id },
        data: { lastSyncAt: new Date() },
      });

      logger.info(`Synced ${orders.length} orders for ${shopDomain}`);
    } catch (error) {
      logger.error('Error syncing orders:', error);
      throw error;
    }
  }

  // Process individual order
  private async processOrder(order: any, storeId: string): Promise<void> {
    try {
      // Check if order already exists
      const existingOrder = await prisma.shopifyOrder.findUnique({
        where: { shopifyOrderId: order.id.toString() },
      });

      if (existingOrder) {
        return; // Order already processed
      }

      // Create order record
      const newOrder = await prisma.shopifyOrder.create({
        data: {
          shopifyOrderId: order.id.toString(),
          orderNumber: order.order_number?.toString() || order.id.toString(),
          customerId: order.customer?.id?.toString(),
          customerEmail: order.customer?.email,
          totalPrice: parseFloat(order.total_price || '0'),
          subtotalPrice: parseFloat(order.subtotal_price || '0'),
          totalTax: parseFloat(order.total_tax || '0'),
          currency: order.currency || 'USD',
          financialStatus: order.financial_status,
          fulfillmentStatus: order.fulfillment_status,
          processedAt: order.processed_at ? new Date(order.processed_at) : null,
          storeId,
        },
      });

      // Create journal entry for the order
      await this.createOrderJournalEntry(newOrder);

      logger.info(`Processed order: ${newOrder.orderNumber}`);
    } catch (error) {
      logger.error('Error processing order:', error);
      throw error;
    }
  }

  // Create journal entry for order
  private async createOrderJournalEntry(order: any): Promise<void> {
    try {
      // Get or create necessary accounts
      const cashAccount = await this.getOrCreateAccount('1000', 'Cash and Cash Equivalents', 'ASSET');
      const salesAccount = await this.getOrCreateAccount('4000', 'Sales Revenue', 'REVENUE');

      // Create journal entry
      const journalEntry = await prisma.journalEntry.create({
        data: {
          reference: `ORD-${order.orderNumber}`,
          description: `Sale - Order ${order.orderNumber}`,
          date: new Date(),
          totalDebit: order.totalPrice,
          totalCredit: order.totalPrice,
          isPosted: true,
          postedAt: new Date(),
          orderId: order.id,
        },
      });

      // Create journal lines
      await prisma.journalLine.createMany({
        data: [
          {
            journalEntryId: journalEntry.id,
            accountId: cashAccount.id,
            debit: order.totalPrice,
            credit: 0,
            description: `Cash received for order ${order.orderNumber}`,
          },
          {
            journalEntryId: journalEntry.id,
            accountId: salesAccount.id,
            debit: 0,
            credit: order.totalPrice,
            description: `Sales revenue for order ${order.orderNumber}`,
          },
        ],
      });

      logger.info(`Created journal entry for order ${order.orderNumber}`);
    } catch (error) {
      logger.error('Error creating journal entry:', error);
      throw error;
    }
  }

  // Get or create account
  private async getOrCreateAccount(code: string, name: string, type: string): Promise<any> {
    let account = await prisma.account.findUnique({
      where: { code },
    });

    if (!account) {
      account = await prisma.account.create({
        data: {
          code,
          name,
          type: type as any,
        },
      });
    }

    return account;
  }

  // Encrypt token
  private encryptToken(token: string): string {
    // Simple encryption - in production, use proper encryption
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY || 'default-key');
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Decrypt token
  private decryptToken(encryptedToken: string): string {
    // Simple decryption - in production, use proper decryption
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY || 'default-key');
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Initialize default chart of accounts
  async initializeChartOfAccounts(): Promise<void> {
    try {
      for (const account of DEFAULT_ACCOUNTS) {
        await prisma.account.upsert({
          where: { code: account.code },
          update: {},
          create: {
            code: account.code,
            name: account.name,
            type: account.type as any,
          },
        });
      }

      logger.info('Chart of accounts initialized');
    } catch (error) {
      logger.error('Error initializing chart of accounts:', error);
      throw error;
    }
  }
}

export const shopifyService = new ShopifyService();
