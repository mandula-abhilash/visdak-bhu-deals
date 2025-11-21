-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'buyer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Lands table
CREATE TABLE IF NOT EXISTS lands (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    location_text TEXT NOT NULL,
    area_sqft DECIMAL(15, 2) NOT NULL,
    area_guntas DECIMAL(10, 2) NOT NULL,
    area_acres DECIMAL(10, 2) NOT NULL,
    area_sqyards DECIMAL(15, 2) NOT NULL,
    price_range VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lands_district ON lands(district);
CREATE INDEX idx_lands_status ON lands(status);
CREATE INDEX idx_lands_price_range ON lands(price_range);
CREATE INDEX idx_lands_created_by ON lands(created_by);

-- Land private information
CREATE TABLE IF NOT EXISTS land_private_info (
    id SERIAL PRIMARY KEY,
    land_id INTEGER UNIQUE REFERENCES lands(id) ON DELETE CASCADE,
    exact_address TEXT,
    owner_name VARCHAR(255),
    survey_number VARCHAR(100),
    exact_price DECIMAL(15, 2),
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_land_private_info_land_id ON land_private_info(land_id);

-- Land boundaries with PostGIS geometry
CREATE TABLE IF NOT EXISTS land_boundaries (
    id SERIAL PRIMARY KEY,
    land_id INTEGER UNIQUE REFERENCES lands(id) ON DELETE CASCADE,
    boundary_polygon GEOMETRY(POLYGON, 4326) NOT NULL,
    center_lat DECIMAL(10, 8) NOT NULL,
    center_lng DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_land_boundaries_land_id ON land_boundaries(land_id);
CREATE INDEX idx_land_boundaries_geom ON land_boundaries USING GIST(boundary_polygon);

-- Land photos
CREATE TABLE IF NOT EXISTS land_photos (
    id SERIAL PRIMARY KEY,
    land_id INTEGER REFERENCES lands(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_land_photos_land_id ON land_photos(land_id);

-- Land documents
CREATE TABLE IF NOT EXISTS land_documents (
    id SERIAL PRIMARY KEY,
    land_id INTEGER REFERENCES lands(id) ON DELETE CASCADE,
    document_url TEXT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_land_documents_land_id ON land_documents(land_id);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    razorpay_subscription_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Site access (per-land purchases)
CREATE TABLE IF NOT EXISTS site_access (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    land_id INTEGER REFERENCES lands(id) ON DELETE CASCADE,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount_paid DECIMAL(10, 2) NOT NULL,
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    UNIQUE(user_id, land_id)
);

CREATE INDEX idx_site_access_user_id ON site_access(user_id);
CREATE INDEX idx_site_access_land_id ON site_access(land_id);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, role)
VALUES ('admin@example.com', '$2b$10$rZ4qK8KP5lQX4K3K4P5lQX4K3K4P5lQX4K3K4P5lQX4K3K4P5lQX4', 'admin')
ON CONFLICT (email) DO NOTHING;
