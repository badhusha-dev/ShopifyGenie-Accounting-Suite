import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export const getReconciliationData = async (req: Request, res: Response) => {
  try {
    const { shop, status } = req.query;

    const where: any = {};
    if (shop) {
      const store = await prisma.shopifyStore.findUnique({
        where: { shopDomain: shop as string },
      });
      if (store) {
        where.payout = { storeId: store.id };
      }
    }
    if (status) {
      where.isMatched = status === 'matched';
    }

    const reconciliationData = await prisma.reconciliationMatch.findMany({
      where,
      include: {
        payout: {
          include: {
            store: {
              select: {
                shopDomain: true,
              },
            },
          },
        },
        account: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: reconciliationData,
    });
  } catch (error) {
    logger.error('Get reconciliation data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get reconciliation data',
    });
  }
};

export const createReconciliationMatch = async (req: Request, res: Response) => {
  try {
    const { payoutId, orderId, amount, accountId } = req.body;

    // Verify payout exists
    const payout = await prisma.shopifyPayout.findUnique({
      where: { id: payoutId },
    });

    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout not found',
      });
    }

    // Verify order exists
    const order = await prisma.shopifyOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // Verify account exists
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
      });
    }

    // Create reconciliation match
    const reconciliationMatch = await prisma.reconciliationMatch.create({
      data: {
        payoutId,
        orderId,
        amount,
        accountId,
        isMatched: true,
        matchedAt: new Date(),
      },
      include: {
        payout: {
          include: {
            store: {
              select: {
                shopDomain: true,
              },
            },
          },
        },
        account: true,
      },
    });

    logger.info(`Reconciliation match created: ${reconciliationMatch.id}`);

    res.status(201).json({
      success: true,
      message: 'Reconciliation match created successfully',
      data: reconciliationMatch,
    });
  } catch (error) {
    logger.error('Create reconciliation match error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create reconciliation match',
    });
  }
};

export const updateReconciliationMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isMatched, amount } = req.body;

    const reconciliationMatch = await prisma.reconciliationMatch.update({
      where: { id },
      data: {
        ...(isMatched !== undefined && { 
          isMatched,
          matchedAt: isMatched ? new Date() : null,
        }),
        ...(amount !== undefined && { amount }),
      },
      include: {
        payout: {
          include: {
            store: {
              select: {
                shopDomain: true,
              },
            },
          },
        },
        account: true,
      },
    });

    logger.info(`Reconciliation match updated: ${reconciliationMatch.id}`);

    res.json({
      success: true,
      message: 'Reconciliation match updated successfully',
      data: reconciliationMatch,
    });
  } catch (error) {
    logger.error('Update reconciliation match error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update reconciliation match',
    });
  }
};

export const deleteReconciliationMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.reconciliationMatch.delete({
      where: { id },
    });

    logger.info(`Reconciliation match deleted: ${id}`);

    res.json({
      success: true,
      message: 'Reconciliation match deleted successfully',
    });
  } catch (error) {
    logger.error('Delete reconciliation match error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete reconciliation match',
    });
  }
};

export const getUnmatchedPayouts = async (req: Request, res: Response) => {
  try {
    const { shop } = req.query;

    const where: any = {
      reconciliationMatches: {
        none: {},
      },
    };

    if (shop) {
      const store = await prisma.shopifyStore.findUnique({
        where: { shopDomain: shop as string },
      });
      if (store) {
        where.storeId = store.id;
      }
    }

    const unmatchedPayouts = await prisma.shopifyPayout.findMany({
      where,
      include: {
        store: {
          select: {
            shopDomain: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: unmatchedPayouts,
    });
  } catch (error) {
    logger.error('Get unmatched payouts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get unmatched payouts',
    });
  }
};

export const getUnmatchedOrders = async (req: Request, res: Response) => {
  try {
    const { shop } = req.query;

    const where: any = {
      reconciliationMatches: {
        none: {},
      },
    };

    if (shop) {
      const store = await prisma.shopifyStore.findUnique({
        where: { shopDomain: shop as string },
      });
      if (store) {
        where.storeId = store.id;
      }
    }

    const unmatchedOrders = await prisma.shopifyOrder.findMany({
      where,
      include: {
        store: {
          select: {
            shopDomain: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: unmatchedOrders,
    });
  } catch (error) {
    logger.error('Get unmatched orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get unmatched orders',
    });
  }
};

export const autoMatchReconciliation = async (req: Request, res: Response) => {
  try {
    const { shop } = req.body;

    const where: any = {};
    if (shop) {
      const store = await prisma.shopifyStore.findUnique({
        where: { shopDomain: shop },
      });
      if (store) {
        where.storeId = store.id;
      }
    }

    // Get unmatched payouts and orders
    const [unmatchedPayouts, unmatchedOrders] = await Promise.all([
      prisma.shopifyPayout.findMany({
        where: {
          ...where,
          reconciliationMatches: {
            none: {},
          },
        },
      }),
      prisma.shopifyOrder.findMany({
        where: {
          ...where,
          reconciliationMatches: {
            none: {},
          },
        },
      }),
    ]);

    let matchesCreated = 0;

    // Simple matching logic: match by amount and date proximity
    for (const payout of unmatchedPayouts) {
      const matchingOrder = unmatchedOrders.find(order => 
        Math.abs(Number(order.totalPrice) - Number(payout.amount)) < 0.01 &&
        Math.abs(order.createdAt.getTime() - payout.createdAt.getTime()) < 7 * 24 * 60 * 60 * 1000 // Within 7 days
      );

      if (matchingOrder) {
        // Get cash account for matching
        const cashAccount = await prisma.account.findFirst({
          where: { code: '1000' },
        });

        if (cashAccount) {
          await prisma.reconciliationMatch.create({
            data: {
              payoutId: payout.id,
              orderId: matchingOrder.id,
              amount: payout.amount,
              accountId: cashAccount.id,
              isMatched: true,
              matchedAt: new Date(),
            },
          });

          matchesCreated++;
        }
      }
    }

    logger.info(`Auto-matched ${matchesCreated} reconciliation entries`);

    res.json({
      success: true,
      message: `Auto-matched ${matchesCreated} reconciliation entries`,
      data: {
        matchesCreated,
        totalPayouts: unmatchedPayouts.length,
        totalOrders: unmatchedOrders.length,
      },
    });
  } catch (error) {
    logger.error('Auto match reconciliation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to auto-match reconciliation entries',
    });
  }
};
