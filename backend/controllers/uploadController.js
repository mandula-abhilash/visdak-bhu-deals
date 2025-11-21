import { uploadToS3 } from '../config/s3.js';
import { query } from '../config/database.js';

export const uploadPhotos = async (req, res) => {
  try {
    const { land_id } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (!land_id) {
      return res.status(400).json({ error: 'Land ID is required' });
    }

    const landResult = await query(
      'SELECT id FROM lands WHERE id = $1 AND created_by = $2',
      [land_id, req.user.userId]
    );

    if (landResult.rows.length === 0) {
      return res.status(404).json({ error: 'Land not found or unauthorized' });
    }

    const uploadPromises = files.map(file => uploadToS3(file, 'photos'));
    const uploadedUrls = await Promise.all(uploadPromises);

    const insertPromises = uploadedUrls.map((url, index) =>
      query(
        'INSERT INTO land_photos (land_id, photo_url, display_order) VALUES ($1, $2, $3)',
        [land_id, url, index]
      )
    );

    await Promise.all(insertPromises);

    res.json({
      message: 'Photos uploaded successfully',
      urls: uploadedUrls
    });
  } catch (error) {
    console.error('Upload photos error:', error);
    res.status(500).json({ error: 'Failed to upload photos' });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const { land_id } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (!land_id) {
      return res.status(400).json({ error: 'Land ID is required' });
    }

    const landResult = await query(
      'SELECT id FROM lands WHERE id = $1 AND created_by = $2',
      [land_id, req.user.userId]
    );

    if (landResult.rows.length === 0) {
      return res.status(404).json({ error: 'Land not found or unauthorized' });
    }

    const uploadPromises = files.map(file => uploadToS3(file, 'documents'));
    const uploadedUrls = await Promise.all(uploadPromises);

    const insertPromises = files.map((file, index) =>
      query(
        'INSERT INTO land_documents (land_id, document_url, document_name, document_type) VALUES ($1, $2, $3, $4)',
        [land_id, uploadedUrls[index], file.originalname, file.mimetype]
      )
    );

    await Promise.all(insertPromises);

    res.json({
      message: 'Documents uploaded successfully',
      documents: files.map((file, index) => ({
        url: uploadedUrls[index],
        name: file.originalname,
        type: file.mimetype
      }))
    });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({ error: 'Failed to upload documents' });
  }
};
