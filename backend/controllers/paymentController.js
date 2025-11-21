import Razorpay from 'razorpay';
import crypto from 'crypto';
import { query } from '../config/database.js';
import { sendPaymentConfirmationEmail } from '../config/ses.js';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createSubscriptionOrder = async (req, res) => {
  try {
    const { plan_type } = req.body;

    if (!['monthly', 'annual'].includes(plan_type)) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    const amount = plan_type === 'monthly' ? 99900 : 999900;

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `sub_${req.user.userId}_${Date.now()}`,
      notes: {
        user_id: req.user.userId,
        plan_type: plan_type
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create subscription order error:', error);
    res.status(500).json({ error: 'Failed to create subscription order' });
  }
};

export const createSitePurchaseOrder = async (req, res) => {
  try {
    const { land_id } = req.body;

    if (!land_id) {
      return res.status(400).json({ error: 'Land ID is required' });
    }

    const landResult = await query('SELECT id FROM lands WHERE id = $1', [land_id]);

    if (landResult.rows.length === 0) {
      return res.status(404).json({ error: 'Land not found' });
    }

    const existingAccess = await query(
      'SELECT id FROM site_access WHERE user_id = $1 AND land_id = $2',
      [req.user.userId, land_id]
    );

    if (existingAccess.rows.length > 0) {
      return res.status(400).json({ error: 'You already have access to this land' });
    }

    const amount = 9900;

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `site_${req.user.userId}_${land_id}_${Date.now()}`,
      notes: {
        user_id: req.user.userId,
        land_id: land_id,
        type: 'site_access'
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create site purchase order error:', error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan_type,
      land_id
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Get user email
    const userResult = await query('SELECT email FROM users WHERE id = $1', [req.user.userId]);
    const userEmail = userResult.rows[0]?.email;

    if (plan_type) {
      const months = plan_type === 'monthly' ? 1 : 12;
      const amount = plan_type === 'monthly' ? 999 : 9999;

      await query(
        `INSERT INTO subscriptions (user_id, plan_type, start_date, end_date, amount_paid, razorpay_payment_id, status)
         VALUES ($1, $2, NOW(), NOW() + INTERVAL '${months} months', $3, $4, 'active')`,
        [req.user.userId, plan_type, amount, razorpay_payment_id]
      );

      // Send confirmation email (non-blocking)
      if (userEmail) {
        sendPaymentConfirmationEmail(userEmail, {
          type: 'subscription',
          amount: amount,
          transactionId: razorpay_payment_id,
        }).catch(err => console.error('Failed to send payment confirmation email:', err));
      }

      res.json({
        message: 'Subscription activated successfully',
        plan_type: plan_type,
        valid_until: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000)
      });
    } else if (land_id) {
      await query(
        'INSERT INTO site_access (user_id, land_id, amount_paid, razorpay_payment_id, razorpay_order_id) VALUES ($1, $2, $3, $4, $5)',
        [req.user.userId, land_id, 99, razorpay_payment_id, razorpay_order_id]
      );

      // Get land details for email
      const landResult = await query('SELECT title FROM lands WHERE id = $1', [land_id]);
      const landTitle = landResult.rows[0]?.title;

      // Send confirmation email (non-blocking)
      if (userEmail) {
        sendPaymentConfirmationEmail(userEmail, {
          type: 'site_purchase',
          amount: 99,
          landTitle: landTitle,
          transactionId: razorpay_payment_id,
        }).catch(err => console.error('Failed to send payment confirmation email:', err));
      }

      res.json({
        message: 'Site access granted successfully',
        land_id: land_id
      });
    } else {
      return res.status(400).json({ error: 'Invalid payment type' });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

export const checkLandAccess = async (req, res) => {
  try {
    const { land_id } = req.params;

    const subscriptionResult = await query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND end_date > NOW() LIMIT 1',
      [req.user.userId]
    );

    if (subscriptionResult.rows.length > 0) {
      return res.json({ hasAccess: true, type: 'subscription' });
    }

    const siteAccessResult = await query(
      'SELECT * FROM site_access WHERE user_id = $1 AND land_id = $2',
      [req.user.userId, land_id]
    );

    if (siteAccessResult.rows.length > 0) {
      return res.json({ hasAccess: true, type: 'site_purchase' });
    }

    res.json({ hasAccess: false });
  } catch (error) {
    console.error('Check land access error:', error);
    res.status(500).json({ error: 'Failed to check access' });
  }
};
