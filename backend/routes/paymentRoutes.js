import express from 'express';
import {
  createSubscriptionOrder,
  createSitePurchaseOrder,
  verifyPayment,
  checkLandAccess
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-subscription', authenticateToken, createSubscriptionOrder);
router.post('/create-site-order', authenticateToken, createSitePurchaseOrder);
router.post('/verify', authenticateToken, verifyPayment);
router.get('/access/:land_id', authenticateToken, checkLandAccess);

export default router;
