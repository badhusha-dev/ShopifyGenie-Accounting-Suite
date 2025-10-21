import express from 'express';
import { authenticate, requireRoleOrHigher } from '../middleware/auth';
import {
  getCashFlowStatement,
  getARAgingReport,
  getAPAgingReport,
  getBudgetVariance,
  getFixedAssetsRegister,
  getAuditTrail,
  getInventoryValuation,
  getFXRevaluation,
  getConsolidatedFinancials,
} from '../controllers/advancedReportsController';
import {
  getKPISummary,
  getSalesTrends,
  getTopProducts,
} from '../controllers/kpiController';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ===== CASH FLOW STATEMENT =====
router.get(
  '/cashflow',
  requireRoleOrHigher('ACCOUNTING'),
  getCashFlowStatement
);

// ===== AR/AP AGING REPORTS =====
router.get(
  '/ar-aging',
  requireRoleOrHigher('ACCOUNTING'),
  getARAgingReport
);

router.get(
  '/ap-aging',
  requireRoleOrHigher('ACCOUNTING'),
  getAPAgingReport
);

// ===== BUDGET VARIANCE =====
router.get(
  '/budget-variance',
  requireRoleOrHigher('ACCOUNTING'),
  getBudgetVariance
);

// ===== FIXED ASSETS REGISTER =====
router.get(
  '/fixed-assets',
  requireRoleOrHigher('ACCOUNTING'),
  getFixedAssetsRegister
);

// ===== AUDIT TRAIL =====
router.get(
  '/audit-trail',
  requireRoleOrHigher('AUDITOR'),
  getAuditTrail
);

// ===== INVENTORY VALUATION =====
router.get(
  '/inventory-valuation',
  requireRoleOrHigher('ACCOUNTING'),
  getInventoryValuation
);

// ===== FX REVALUATION =====
router.get(
  '/fx-revaluation',
  requireRoleOrHigher('ACCOUNTING'),
  getFXRevaluation
);

// ===== CONSOLIDATED FINANCIALS =====
router.get(
  '/consolidated',
  requireRoleOrHigher('ACCOUNTING'),
  getConsolidatedFinancials
);

// ===== KPI DASHBOARD =====
router.get(
  '/kpi-summary',
  requireRoleOrHigher('ACCOUNTING'),
  getKPISummary
);

router.get(
  '/sales-trends',
  requireRoleOrHigher('ACCOUNTING'),
  getSalesTrends
);

router.get(
  '/top-products',
  requireRoleOrHigher('ACCOUNTING'),
  getTopProducts
);

export default router;

