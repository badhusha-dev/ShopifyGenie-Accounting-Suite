import { Router } from 'express';
import {
  getTrialBalance,
  getProfitLoss,
  getBalanceSheet,
  getTaxSummary,
  getDashboardStats,
} from '../controllers/reportsController';
import { authenticate, requireRoleOrHigher } from '../middleware/auth';
import { UserRole } from '@shopifygenie/shared';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard stats (available to all authenticated users)
router.get('/dashboard', getDashboardStats);

// Financial reports (require accounting role or higher)
router.get('/trial-balance', requireRoleOrHigher('ACCOUNTING'), getTrialBalance);
router.get('/pnl', requireRoleOrHigher('ACCOUNTING'), getProfitLoss);
router.get('/balance-sheet', requireRoleOrHigher('ACCOUNTING'), getBalanceSheet);
router.get('/tax-summary', requireRoleOrHigher('ACCOUNTING'), getTaxSummary);

export default router;
