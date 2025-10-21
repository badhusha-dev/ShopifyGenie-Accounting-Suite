import { Router } from 'express';
import {
  getAccounts,
  createAccount,
  updateAccount,
  getJournalEntries,
  createJournalEntry,
  postJournalEntry,
  getJournalEntryDetails,
  validateCreateAccount,
  validateCreateJournalEntry,
} from '../controllers/accountingController';
import { authenticate, requireRoleOrHigher } from '../middleware/auth';
import { UserRole } from '@shopifygenie/shared';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Account routes
router.get('/accounts', getAccounts);
router.post('/accounts', requireRoleOrHigher('ACCOUNTING'), validateCreateAccount, createAccount);
router.put('/accounts/:id', requireRoleOrHigher('ACCOUNTING'), updateAccount);

// Journal entry routes
router.get('/journals', getJournalEntries);
router.post('/journals', requireRoleOrHigher('ACCOUNTING'), validateCreateJournalEntry, createJournalEntry);
router.get('/journals/:id', getJournalEntryDetails);
router.put('/journals/:id/post', requireRoleOrHigher('ACCOUNTING'), postJournalEntry);

export default router;
