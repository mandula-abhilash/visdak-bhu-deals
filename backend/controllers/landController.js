import { query } from '../config/database.js';
import { validatePolygon, sanitizeInput } from '../utils/validators.js';
import { calculatePolygonArea, formatArea } from '../utils/areaConversion.js';

export const createLand = async (req, res) => {
  const client = await query.getClient ? await query.getClient() : null;

  try {
    const {
      title,
      district,
      location_text,
      price_range,
      description,
      boundary_polygon,
      exact_address,
      owner_name,
      survey_number,
      exact_price,
      contact_info
    } = req.body;

    if (!title || !district || !location_text || !price_range || !boundary_polygon) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const coordinates = JSON.parse(boundary_polygon);

    if (!validatePolygon(coordinates)) {
      return res.status(400).json({ error: 'Invalid polygon coordinates' });
    }

    const areaSqFeet = calculatePolygonArea(coordinates);
    const areas = formatArea(areaSqFeet);

    const centerLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
    const centerLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length;

    const polygonWKT = `POLYGON((${coordinates.map(c => `${c.lng} ${c.lat}`).join(',')},${coordinates[0].lng} ${coordinates[0].lat}))`;

    if (client) await client.query('BEGIN');

    const landResult = await query(
      `INSERT INTO lands (title, district, location_text, area_sqft, area_guntas, area_acres, area_sqyards, price_range, description, created_by, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active')
       RETURNING *`,
      [
        sanitizeInput(title),
        sanitizeInput(district),
        sanitizeInput(location_text),
        areas.sq_feet,
        areas.guntas,
        areas.acres,
        areas.sq_yards,
        price_range,
        sanitizeInput(description),
        req.user.userId
      ]
    );

    const land = landResult.rows[0];

    await query(
      `INSERT INTO land_boundaries (land_id, boundary_polygon, center_lat, center_lng)
       VALUES ($1, ST_GeomFromText($2, 4326), $3, $4)`,
      [land.id, polygonWKT, centerLat, centerLng]
    );

    await query(
      `INSERT INTO land_private_info (land_id, exact_address, owner_name, survey_number, exact_price, contact_info)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        land.id,
        sanitizeInput(exact_address),
        sanitizeInput(owner_name),
        sanitizeInput(survey_number),
        exact_price,
        sanitizeInput(contact_info)
      ]
    );

    if (client) await client.query('COMMIT');

    res.status(201).json({
      message: 'Land created successfully',
      land: {
        ...land,
        center_lat: centerLat,
        center_lng: centerLng
      }
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error('Create land error:', error);
    res.status(500).json({ error: 'Failed to create land' });
  } finally {
    if (client) client.release();
  }
};

export const getAllLands = async (req, res) => {
  try {
    const { district, price_range, min_area, max_area } = req.query;

    let queryText = `
      SELECT l.*, lb.center_lat, lb.center_lng,
             array_agg(lp.photo_url ORDER BY lp.display_order) as photos
      FROM lands l
      LEFT JOIN land_boundaries lb ON l.id = lb.land_id
      LEFT JOIN land_photos lp ON l.id = lp.land_id
      WHERE l.status = 'active'
    `;

    const params = [];
    let paramCount = 1;

    if (district) {
      queryText += ` AND l.district = $${paramCount}`;
      params.push(district);
      paramCount++;
    }

    if (price_range) {
      queryText += ` AND l.price_range = $${paramCount}`;
      params.push(price_range);
      paramCount++;
    }

    if (min_area) {
      queryText += ` AND l.area_sqft >= $${paramCount}`;
      params.push(parseFloat(min_area));
      paramCount++;
    }

    if (max_area) {
      queryText += ` AND l.area_sqft <= $${paramCount}`;
      params.push(parseFloat(max_area));
      paramCount++;
    }

    queryText += ' GROUP BY l.id, lb.center_lat, lb.center_lng ORDER BY l.created_at DESC';

    const result = await query(queryText, params);

    res.json({ lands: result.rows });
  } catch (error) {
    console.error('Get lands error:', error);
    res.status(500).json({ error: 'Failed to fetch lands' });
  }
};

export const getLandById = async (req, res) => {
  try {
    const { id } = req.params;

    const landResult = await query(
      `SELECT l.*, lb.center_lat, lb.center_lng,
              ST_AsGeoJSON(lb.boundary_polygon) as boundary_geojson
       FROM lands l
       LEFT JOIN land_boundaries lb ON l.id = lb.land_id
       WHERE l.id = $1 AND l.status = 'active'`,
      [id]
    );

    if (landResult.rows.length === 0) {
      return res.status(404).json({ error: 'Land not found' });
    }

    const land = landResult.rows[0];

    const photosResult = await query(
      'SELECT photo_url FROM land_photos WHERE land_id = $1 ORDER BY display_order',
      [id]
    );

    land.photos = photosResult.rows.map(p => p.photo_url);

    res.json({ land });
  } catch (error) {
    console.error('Get land by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch land details' });
  }
};

export const getLandFullDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.hasFullAccess) {
      return res.status(403).json({ error: 'Subscription or purchase required for full details' });
    }

    const landResult = await query(
      `SELECT l.*, lb.center_lat, lb.center_lng,
              ST_AsGeoJSON(lb.boundary_polygon) as boundary_geojson,
              lpi.exact_address, lpi.owner_name, lpi.survey_number,
              lpi.exact_price, lpi.contact_info
       FROM lands l
       LEFT JOIN land_boundaries lb ON l.id = lb.land_id
       LEFT JOIN land_private_info lpi ON l.id = lpi.land_id
       WHERE l.id = $1 AND l.status = 'active'`,
      [id]
    );

    if (landResult.rows.length === 0) {
      return res.status(404).json({ error: 'Land not found' });
    }

    const land = landResult.rows[0];

    const photosResult = await query(
      'SELECT photo_url FROM land_photos WHERE land_id = $1 ORDER BY display_order',
      [id]
    );

    const documentsResult = await query(
      'SELECT document_url, document_name, document_type FROM land_documents WHERE land_id = $1',
      [id]
    );

    land.photos = photosResult.rows.map(p => p.photo_url);
    land.documents = documentsResult.rows;

    res.json({ land });
  } catch (error) {
    console.error('Get land full details error:', error);
    res.status(500).json({ error: 'Failed to fetch land details' });
  }
};

export const searchLandsByRadius = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng || !radius) {
      return res.status(400).json({ error: 'Latitude, longitude, and radius are required' });
    }

    const radiusInMeters = parseFloat(radius) * 1000;

    const result = await query(
      `SELECT l.*, lb.center_lat, lb.center_lng,
              ST_Distance(
                ST_GeomFromText('POINT(${parseFloat(lng)} ${parseFloat(lat)})', 4326)::geography,
                lb.boundary_polygon::geography
              ) as distance
       FROM lands l
       LEFT JOIN land_boundaries lb ON l.id = lb.land_id
       WHERE l.status = 'active'
       AND ST_DWithin(
         ST_GeomFromText('POINT(${parseFloat(lng)} ${parseFloat(lat)})', 4326)::geography,
         lb.boundary_polygon::geography,
         $1
       )
       ORDER BY distance`,
      [radiusInMeters]
    );

    res.json({ lands: result.rows });
  } catch (error) {
    console.error('Search by radius error:', error);
    res.status(500).json({ error: 'Failed to search lands' });
  }
};

export const updateLand = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, district, location_text, price_range, description, status } = req.body;

    const result = await query(
      `UPDATE lands
       SET title = COALESCE($1, title),
           district = COALESCE($2, district),
           location_text = COALESCE($3, location_text),
           price_range = COALESCE($4, price_range),
           description = COALESCE($5, description),
           status = COALESCE($6, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND created_by = $8
       RETURNING *`,
      [
        title ? sanitizeInput(title) : null,
        district ? sanitizeInput(district) : null,
        location_text ? sanitizeInput(location_text) : null,
        price_range,
        description ? sanitizeInput(description) : null,
        status,
        id,
        req.user.userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Land not found or unauthorized' });
    }

    res.json({ message: 'Land updated successfully', land: result.rows[0] });
  } catch (error) {
    console.error('Update land error:', error);
    res.status(500).json({ error: 'Failed to update land' });
  }
};

export const deleteLand = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM lands WHERE id = $1 AND created_by = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Land not found or unauthorized' });
    }

    res.json({ message: 'Land deleted successfully' });
  } catch (error) {
    console.error('Delete land error:', error);
    res.status(500).json({ error: 'Failed to delete land' });
  }
};
