import express from 'express';
import { register, login, verifyToken, getSubscriptionStatus, requestPasswordReset, resetPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', authenticateToken, verifyToken);
router.get('/subscription-status', authenticateToken, getSubscriptionStatus);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
