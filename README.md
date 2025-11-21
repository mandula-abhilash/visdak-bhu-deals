# Land Listing Platform

A comprehensive land listing platform with map drawing, measurement tools, and payment integration.

## Features

- **Admin Land Entry**: Draw land boundaries directly on Google Maps with real-time area calculation
- **Search with Measurements**: Distance, radius, and area measurement tools
- **Public Listings**: Browse lands with static map previews
- **Paid Access**: Subscribe or purchase individual land details for full information
- **Interactive Maps**: Full Google Maps integration with exact boundaries for paid users
- **Secure Authentication**: JWT-based auth with role-based access control and password reset
- **Payment Integration**: Razorpay for subscriptions and one-time purchases
- **Email Notifications**: AWS SES for welcome emails, password resets, and payment confirmations
- **File Storage**: Contabo S3 for photos and documents

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with PostGIS extension
- **Storage**: Contabo S3
- **Authentication**: JWT
- **Payment**: Razorpay
- **Email**: AWS SES
- **Maps**: Google Maps API

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ with PostGIS extension
- Contabo Server with PostgreSQL and S3 configured
- Google Maps API key
- Razorpay account
- AWS account with SES configured

## Installation

### 1. Clone and Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Update the \`.env\` file with your actual credentials:

\`\`\`env
# Database - Your Contabo PostgreSQL
DB_HOST=your_contabo_ip
DB_PORT=5432
DB_NAME=land_listings
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Secret - Generate a strong random string
JWT_SECRET=your_jwt_secret_key_here

# Contabo S3 Configuration
S3_ENDPOINT=your_contabo_s3_endpoint
S3_ACCESS_KEY_ID=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_key
S3_BUCKET_NAME=land-listings

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# AWS SES Configuration
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY_ID=your_aws_ses_access_key
AWS_SES_SECRET_ACCESS_KEY=your_aws_ses_secret_key
AWS_SES_FROM_EMAIL=noreply@yourdomain.com
\`\`\`

### 3. Setup Database

Connect to your PostgreSQL database on Contabo and run:

\`\`\`bash
psql -U your_db_user -d land_listings -f backend/database/schema.sql
\`\`\`

This will:
- Enable PostGIS extension
- Create all necessary tables
- Set up indexes for performance
- Create a default admin user (email: admin@example.com, password: admin123)

**Important**: Change the default admin password after first login!

### 4. Update Google Maps API Key

Replace \`YOUR_GOOGLE_MAPS_API_KEY\` in these files with your actual API key:
- \`frontend/pages/admin-land-form.html\`
- \`frontend/pages/search.html\`
- \`frontend/pages/land-detail.html\`

### 5. Run Locally

\`\`\`bash
npm start
\`\`\`

The application will be available at http://localhost:3000

## Deployment on Contabo

### 1. Install Required Software on Contabo

\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL with PostGIS
sudo apt install -y postgresql postgresql-contrib postgis

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -g pm2
\`\`\`

### 2. Setup PostgreSQL

\`\`\`bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE land_listings;
CREATE USER your_db_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE land_listings TO your_db_user;

# Exit psql
\\q

# Enable PostGIS and run schema
sudo -u postgres psql -d land_listings -c "CREATE EXTENSION postgis;"
psql -U your_db_user -d land_listings -f backend/database/schema.sql
\`\`\`

### 3. Deploy Application

\`\`\`bash
# Clone or upload your application to Contabo
cd /var/www/land-listings

# Install dependencies
npm install --production

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
\`\`\`

### 4. Configure Nginx

\`\`\`bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/land-listings

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/land-listings /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
\`\`\`

### 5. Setup SSL with Let's Encrypt

\`\`\`bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically configure nginx for SSL
\`\`\`

### 6. Setup AWS SES

Before deploying, configure AWS SES:

1. **Create AWS Account & Access SES Console**
   - Go to AWS Console → Simple Email Service (SES)

2. **Verify Your Domain**
   - Navigate to "Verified identities"
   - Click "Create identity" → Select "Domain"
   - Add your domain and follow DNS verification steps

3. **Verify From Email Address**
   - Add the email address you'll use as sender (e.g., noreply@yourdomain.com)
   - Click verification link sent to that email

4. **Move Out of Sandbox Mode**
   - By default, SES is in sandbox mode (can only send to verified emails)
   - Request production access: SES Console → Account Dashboard → Request production access
   - Fill out the form explaining your use case

5. **Create IAM User for SES**
   - Go to IAM Console → Users → Create user
   - Attach policy: `AmazonSESFullAccess`
   - Create access keys and save them

6. **Update Environment Variables**
   - Add the IAM user credentials to your `.env` file
   - Set the verified from email address

7. **Test Email Sending**
   ```bash
   # After deployment, test with user registration
   # Welcome emails will be sent automatically
   ```

### 7. Setup Firewall

\`\`\`bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
\`\`\`

## Project Structure

\`\`\`
project/
├── backend/
│   ├── config/          # Database and S3 configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth and upload middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── database/        # SQL schema
│   └── server.js        # Express server
├── frontend/
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript modules
│   ├── pages/          # HTML pages
│   └── assets/         # Static assets
├── .env                # Environment variables
├── ecosystem.config.js # PM2 configuration
└── nginx.conf          # Nginx configuration
\`\`\`

## API Endpoints

### Authentication
- POST \`/api/auth/register\` - Register new user
- POST \`/api/auth/login\` - Login user
- GET \`/api/auth/verify\` - Verify JWT token
- GET \`/api/auth/subscription-status\` - Get subscription status

### Lands
- GET \`/api/lands\` - Get all lands (public)
- GET \`/api/lands/:id\` - Get land basic details
- GET \`/api/lands/:id/full\` - Get full land details (requires auth)
- GET \`/api/lands/search/radius\` - Search lands by radius
- POST \`/api/lands\` - Create land (admin/agent only)
- PUT \`/api/lands/:id\` - Update land (admin/agent only)
- DELETE \`/api/lands/:id\` - Delete land (admin/agent only)

### Uploads
- POST \`/api/upload/photos\` - Upload land photos
- POST \`/api/upload/documents\` - Upload land documents

### Payments
- POST \`/api/payment/create-subscription\` - Create subscription order
- POST \`/api/payment/create-site-order\` - Create site purchase order
- POST \`/api/payment/verify\` - Verify payment
- GET \`/api/payment/access/:land_id\` - Check land access

## Area Conversions

The platform uses Telangana standard conversions:
- 1 acre = 43,560 square feet
- 1 gunta = 1,089 square feet
- 1 square yard = 9 square feet

## Default Admin Credentials

- Email: admin@example.com
- Password: admin123

**Change this immediately after first login!**

## Maintenance

### View Logs
\`\`\`bash
pm2 logs land-listings
\`\`\`

### Restart Application
\`\`\`bash
pm2 restart land-listings
\`\`\`

### Database Backup
\`\`\`bash
pg_dump -U your_db_user land_listings > backup_$(date +%Y%m%d).sql
\`\`\`

### Monitor Performance
\`\`\`bash
pm2 monit
\`\`\`

## Support

For issues and questions, please refer to the documentation or contact support.
