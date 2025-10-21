import { Router } from 'express';
import {
  getReconciliationData,
  createReconciliationMatch,
  updateReconciliationMatch,
  deleteReconciliationMatch,
  getUnmatchedPayouts,
  getUnmatchedOrders,
  autoMatchReconciliation,
} from '../controllers/reconciliationController';
import { authenticate, requireRoleOrHigher } from '../middleware/auth';
import { UserRole } from '@shopifygenie/shared';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Reconciliation data routes
router.get('/', getReconciliationData);
router.get('/unmatched-payouts', getUnmatchedPayouts);
router.get('/unmatched-orders', getUnmatchedOrders);

// Reconciliation match routes (require accounting role or higher)
router.post('/', requireRoleOrHigher('ACCOUNTING'), createReconciliationMatch);
router.put('/:id', requireRoleOrHigher('ACCOUNTING'), updateReconciliationMatch);
router.delete('/:id', requireRoleOrHigher('ACCOUNTING'), deleteReconciliationMatch);

// Auto-matching (require accounting role or higher)
router.post('/auto-match', requireRoleOrHigher('ACCOUNTING'), autoMatchReconciliation);

export default router;
