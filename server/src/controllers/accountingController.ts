import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { generateReference } from '@shopifygenie/shared';

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const { type, parentId, isActive } = req.query;

    const where: any = {};
    if (type) where.type = type;
    if (parentId) where.parentId = parentId;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const accounts = await prisma.account.findMany({
      where,
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            journalLines: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    res.json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    logger.error('Get accounts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get accounts',
    });
  }
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { code, name, type, parentId } = req.body;

    // Check if account code already exists
    const existingAccount = await prisma.account.findUnique({
      where: { code },
    });

    if (existingAccount) {
      return res.status(409).json({
        success: false,
        error: 'Account code already exists',
      });
    }

    const account = await prisma.account.create({
      data: {
        code,
        name,
        type,
        parentId: parentId || null,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    logger.info(`Account created: ${account.code} - ${account.name}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: account,
    });
  } catch (error) {
    logger.error('Create account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create account',
    });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, parentId, isActive } = req.body;

    const account = await prisma.account.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(parentId !== undefined && { parentId: parentId || null }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        parent: true,
        children: true,
      },
    });

    logger.info(`Account updated: ${account.code} - ${account.name}`);

    res.json({
      success: true,
      message: 'Account updated successfully',
      data: account,
    });
  } catch (error) {
    logger.error('Update account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update account',
    });
  }
};

export const getJournalEntries = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, startDate, endDate, isPosted } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }
    if (isPosted !== undefined) where.isPosted = isPosted === 'true';

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        include: {
          lines: {
            include: {
              account: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        skip: offset,
        take: Number(limit),
      }),
      prisma.journalEntry.count({ where }),
    ]);

    res.json({
      success: true,
      data: entries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Get journal entries error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get journal entries',
    });
  }
};

export const createJournalEntry = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { description, date, lines, isPosted = false } = req.body;

    // Validate that debits equal credits
    const totalDebit = lines.reduce((sum: number, line: any) => sum + (line.debit || 0), 0);
    const totalCredit = lines.reduce((sum: number, line: any) => sum + (line.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return res.status(400).json({
        success: false,
        error: 'Total debits must equal total credits',
      });
    }

    // Create journal entry with lines in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const journalEntry = await tx.journalEntry.create({
        data: {
          reference: generateReference('JE'),
          description,
          date: new Date(date),
          totalDebit,
          totalCredit,
          isPosted,
          postedAt: isPosted ? new Date() : null,
        },
      });

      const journalLines = await Promise.all(
        lines.map((line: any) =>
          tx.journalLine.create({
            data: {
              journalEntryId: journalEntry.id,
              accountId: line.accountId,
              debit: line.debit || 0,
              credit: line.credit || 0,
              description: line.description,
            },
          })
        )
      );

      return { journalEntry, journalLines };
    });

    logger.info(`Journal entry created: ${result.journalEntry.reference}`);

    res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: result.journalEntry,
    });
  } catch (error) {
    logger.error('Create journal entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create journal entry',
    });
  }
};

export const postJournalEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const journalEntry = await prisma.journalEntry.findUnique({
      where: { id },
      include: { lines: true },
    });

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found',
      });
    }

    if (journalEntry.isPosted) {
      return res.status(400).json({
        success: false,
        error: 'Journal entry is already posted',
      });
    }

    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: {
        isPosted: true,
        postedAt: new Date(),
      },
    });

    logger.info(`Journal entry posted: ${updatedEntry.reference}`);

    res.json({
      success: true,
      message: 'Journal entry posted successfully',
      data: updatedEntry,
    });
  } catch (error) {
    logger.error('Post journal entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to post journal entry',
    });
  }
};

export const getJournalEntryDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const journalEntry = await prisma.journalEntry.findUnique({
      where: { id },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    });

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found',
      });
    }

    res.json({
      success: true,
      data: journalEntry,
    });
  } catch (error) {
    logger.error('Get journal entry details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get journal entry details',
    });
  }
};

// Validation middleware
export const validateCreateAccount = [
  body('code')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Account code is required'),
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Account name is required'),
  body('type')
    .isIn(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE', 'COST_OF_GOODS_SOLD'])
    .withMessage('Invalid account type'),
];

export const validateCreateJournalEntry = [
  body('description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Description is required'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('lines')
    .isArray({ min: 2 })
    .withMessage('At least 2 journal lines are required'),
  body('lines.*.accountId')
    .isUUID()
    .withMessage('Valid account ID is required'),
  body('lines.*.debit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Debit must be a positive number'),
  body('lines.*.credit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Credit must be a positive number'),
];
