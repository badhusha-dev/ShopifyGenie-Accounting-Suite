import { Router } from 'express';
import {
  install,
  callback,
  sync,
  getStores,
  getOrders,
  getOrderDetails,
  handleWebhook,
} from '../controllers/shopifyController';
import { authenticate, requireRoleOrHigher } from '../middleware/auth';
import { UserRole } from '@shopifygenie/shared';

const router = Router();

// Public webhook routes (no authentication required)
router.post('/webhooks/orders-paid', handleWebhook);
router.post('/webhooks/orders-fulfilled', handleWebhook);
router.post('/webhooks/refunds-create', handleWebhook);

// Protected routes
router.get('/install', authenticate, install);
router.get('/callback', authenticate, callback);
router.post('/sync', authenticate, requireRoleOrHigher('SHOPIFY_MANAGER'), sync);
router.get('/stores', authenticate, getStores);
router.get('/orders', authenticate, getOrders);
router.get('/orders/:id', authenticate, getOrderDetails);

export default router;
