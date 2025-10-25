import express from 'express';
import {
  getSettings,
  updateSettings,
  resetSettings,
  getAllUsers,
  updateUser,
} from '../controllers/settingsController';
import { authenticate, requireRoleOrHigher } from '../middleware/auth';

const router = express.Router();

// Settings routes
router.get('/', authenticate, getSettings);
router.put('/', authenticate, requireRoleOrHigher('ACCOUNTING'), updateSettings);
router.post('/reset', authenticate, requireRoleOrHigher('SUPER_ADMIN'), resetSettings);

// User management routes
router.get('/users', authenticate, requireRoleOrHigher('SUPER_ADMIN'), getAllUsers);
router.put('/users/:id', authenticate, requireRoleOrHigher('SUPER_ADMIN'), updateUser);

export default router;

