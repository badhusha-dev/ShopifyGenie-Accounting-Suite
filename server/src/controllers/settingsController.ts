import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Get system settings
 * Returns the first (and only) settings record
 */
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.setting.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.setting.create({
        data: {
          companyName: 'ShopifyGenie Accounting Suite',
          baseCurrency: 'MYR',
          syncFrequency: 'daily',
          autoSync: false,
          webhooksEnabled: true,
          dateFormat: 'YYYY-MM-DD',
          timeZone: 'Asia/Kuala_Lumpur',
          enableAuditLog: true,
          requireApproval: false,
        },
      });
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    logger.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get settings',
    });
  }
};

/**
 * Update system settings
 * Updates the existing settings or creates new if none exist
 */
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Validate fiscal year start if provided
    if (data.fiscalYearStart) {
      data.fiscalYearStart = new Date(data.fiscalYearStart);
    }

    const existing = await prisma.setting.findFirst();
    let updated;

    if (existing) {
      updated = await prisma.setting.update({
        where: { id: existing.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      logger.info(`Settings updated by user ${req.user?.id}`);
    } else {
      updated = await prisma.setting.create({
        data,
      });
      logger.info(`Settings created by user ${req.user?.id}`);
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: updated,
    });
  } catch (error) {
    logger.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings',
    });
  }
};

/**
 * Reset settings to defaults
 * Admin only
 */
export const resetSettings = async (req: Request, res: Response) => {
  try {
    const existing = await prisma.setting.findFirst();

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'No settings found to reset',
      });
    }

    const reset = await prisma.setting.update({
      where: { id: existing.id },
      data: {
        companyName: 'ShopifyGenie Accounting Suite',
        companyAddress: null,
        companyPhone: null,
        companyEmail: null,
        companyTaxId: null,
        baseCurrency: 'MYR',
        fiscalYearStart: null,
        defaultSalesAccountId: null,
        defaultCOGSAccountId: null,
        defaultTaxAccountId: null,
        defaultFeeAccountId: null,
        defaultARAccountId: null,
        defaultAPAccountId: null,
        defaultCashAccountId: null,
        shopDomain: null,
        shopifyApiKey: null,
        shopifyApiSecret: null,
        syncFrequency: 'daily',
        autoSync: false,
        webhooksEnabled: true,
        dateFormat: 'YYYY-MM-DD',
        timeZone: 'Asia/Kuala_Lumpur',
        enableAuditLog: true,
        requireApproval: false,
        updatedAt: new Date(),
      },
    });

    logger.info(`Settings reset to defaults by user ${req.user?.id}`);

    res.json({
      success: true,
      message: 'Settings reset to defaults',
      data: reset,
    });
  } catch (error) {
    logger.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset settings',
    });
  }
};

/**
 * Get all users (for user management in settings)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
    });
  }
};

/**
 * Update user role or active status
 * Admin only
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    // Prevent user from deactivating themselves
    if (id === req.user?.id && isActive === false) {
      return res.status(400).json({
        success: false,
        error: 'You cannot deactivate your own account',
      });
    }

    const data: any = {};
    if (role !== undefined) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`User ${id} updated by ${req.user?.id}`);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updated,
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
    });
  }
};

