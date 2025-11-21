import express from 'express';
import {
  createLand,
  getAllLands,
  getLandById,
  getLandFullDetails,
  searchLandsByRadius,
  updateLand,
  deleteLand
} from '../controllers/landController.js';
import { authenticateToken, authorizeRole, checkLandAccess } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('admin', 'agent'), createLand);
router.get('/', getAllLands);
router.get('/search/radius', searchLandsByRadius);
router.get('/:id', getLandById);
router.get('/:id/full', authenticateToken, checkLandAccess, getLandFullDetails);
router.put('/:id', authenticateToken, authorizeRole('admin', 'agent'), updateLand);
router.delete('/:id', authenticateToken, authorizeRole('admin', 'agent'), deleteLand);

export default router;
