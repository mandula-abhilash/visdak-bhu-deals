import express from 'express';
import { uploadPhotos as uploadPhotosController, uploadDocuments as uploadDocumentsController } from '../controllers/uploadController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { uploadPhotos, uploadDocuments } from '../middleware/upload.js';

const router = express.Router();

router.post('/photos', authenticateToken, authorizeRole('admin', 'agent'), uploadPhotos, uploadPhotosController);
router.post('/documents', authenticateToken, authorizeRole('admin', 'agent'), uploadDocuments, uploadDocumentsController);

export default router;
