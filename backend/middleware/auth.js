import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const checkSubscription = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next();
    }

    const { query } = await import('../config/database.js');
    const result = await query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND end_date > NOW() ORDER BY end_date DESC LIMIT 1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Active subscription required' });
    }

    req.subscription = result.rows[0];
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ error: 'Failed to verify subscription' });
  }
};

export const checkLandAccess = async (req, res, next) => {
  try {
    const landId = req.params.id || req.params.landId;

    if (req.user.role === 'admin') {
      return next();
    }

    const { query } = await import('../config/database.js');

    const subscriptionResult = await query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND end_date > NOW() LIMIT 1',
      [req.user.userId]
    );

    if (subscriptionResult.rows.length > 0) {
      req.hasFullAccess = true;
      return next();
    }

    const siteAccessResult = await query(
      'SELECT * FROM site_access WHERE user_id = $1 AND land_id = $2',
      [req.user.userId, landId]
    );

    if (siteAccessResult.rows.length > 0) {
      req.hasFullAccess = true;
      return next();
    }

    req.hasFullAccess = false;
    next();
  } catch (error) {
    console.error('Land access check error:', error);
    res.status(500).json({ error: 'Failed to verify access' });
  }
};
