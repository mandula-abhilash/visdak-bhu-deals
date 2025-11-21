# BhuDeals - Smart Land Listing Platform

BhuDeals is a modern land listing and discovery platform that connects buyers, landowners, and agents through verified listings and premium digital services. Built with transparency, clarity, and ease to revolutionize land exploration.

## Business Model

**BhuDeals is a listing and discovery platform only.** We do not participate in property transactions, take commissions, or act as brokers. All interactions, negotiations, and financial dealings are directly between buyers, landowners, and agents.

### Revenue Streams

1. **Premium Listing Boosts** - Enhanced visibility for land listings
2. **Agent Subscriptions** - Premium tools and features for agents
3. **Digital Scouting Services** - Custom land requirement matching
4. **Platform Subscriptions** - Full access to premium features

## Key Features

### For Buyers
- **Verified Land Information** - Detailed land data with maps and media
- **Direct Contact** - Connect directly with owners and agents
- **Advanced Search** - Map-based browsing with filters
- **Digital Scouting** - Submit requirements for personalized matches
- **Area Insights** - Development information and location data

### For Landowners
- **Free Listings** - Post your land at no cost
- **Verified Buyer Enquiries** - Connect with genuine buyers
- **Premium Visibility** - Optional listing boost services
- **Professional Media** - Optional photography services
- **Direct Communication** - Manage inquiries directly

### For Agents
- **Unlimited Listings** - Manage multiple properties
- **Lead Management** - Track and respond to inquiries
- **Premium Profiles** - Enhanced visibility and branding
- **Digital Presence** - Professional agent profile pages
- **WhatsApp Integration** - Quick communication with clients

## Tech Stack

### Frontend
- **Next.js 14** - App Router with React 18
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, responsive design
- **Google Maps API** - Interactive maps and drawing tools
- **Lucide React** - Beautiful icons

### Backend
- **Node.js & Express** - RESTful API server
- **PostgreSQL** - Relational database with PostGIS
- **JWT Authentication** - Secure user authentication
- **Multer** - File upload handling
- **AWS S3** - Media storage
- **AWS SES** - Email notifications
- **Razorpay** - Payment processing

### Infrastructure
- **PM2** - Process management
- **Nginx** - Reverse proxy and load balancing
- **Contabo** - Server hosting
- **Let's Encrypt** - SSL certificates

## Land Categories

- Agricultural Lands
- Farm Lands
- Residential Open Plots
- Venture Plots
- Commercial Lands
- Industrial/Logistics Lands
- Highway-Adjacent Properties
- Investment-Grade Lands
- Farmhouse Sites

## Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ with PostGIS extension
- AWS account (S3 & SES)
- Google Maps API key
- Razorpay account
- Server access (Contabo or similar)

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=bhudeals
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Secret
JWT_SECRET=your_secure_jwt_secret

# AWS S3 Configuration
S3_ENDPOINT=your_s3_endpoint
S3_ACCESS_KEY_ID=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_key
S3_BUCKET_NAME=bhudeals-media

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# AWS SES Configuration
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY_ID=your_ses_access_key
AWS_SES_SECRET_ACCESS_KEY=your_ses_secret_key
AWS_SES_FROM_EMAIL=noreply@bhudeals.com

# Server Configuration
PORT=3000
NODE_ENV=production
```

### 3. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE bhudeals;

# Connect to database
\c bhudeals

# Enable PostGIS extension
CREATE EXTENSION postgis;

# Exit psql
\q

# Run schema
psql -U your_db_user -d bhudeals -f backend/database/schema.sql
```

### 4. Development

```bash
# Run both frontend and backend
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Build frontend
npm run build
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

### 5. Production Deployment

```bash
# Build frontend
cd frontend
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

## Project Structure

```
bhudeals/
├── backend/
│   ├── config/              # Configuration files
│   │   ├── database.js      # PostgreSQL connection
│   │   ├── s3.js           # AWS S3 setup
│   │   └── ses.js          # AWS SES setup
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── landController.js
│   │   ├── paymentController.js
│   │   └── uploadController.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js         # JWT authentication
│   │   └── upload.js       # File upload handling
│   ├── routes/             # API routes
│   │   ├── authRoutes.js
│   │   ├── landRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/              # Helper functions
│   │   ├── areaConversion.js
│   │   └── validators.js
│   ├── database/           # Database schema
│   │   └── schema.sql
│   └── server.js           # Express application
├── frontend/
│   ├── app/                # Next.js app directory
│   │   ├── admin/         # Admin pages
│   │   ├── land/          # Land detail pages
│   │   ├── layout.jsx     # Root layout
│   │   ├── page.jsx       # Home page
│   │   ├── globals.css    # Global styles
│   │   ├── login/
│   │   ├── register/
│   │   └── search/
│   ├── components/         # React components
│   │   ├── MapDrawing.tsx
│   │   └── Navbar.jsx
│   └── lib/               # Utilities
│       ├── api.ts         # API client
│       ├── area-calculator.ts
│       └── auth-context.jsx
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── ecosystem.config.js    # PM2 configuration
├── nginx.conf             # Nginx configuration
├── package.json           # Project dependencies
└── README.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/subscription-status` - Get subscription status

### Lands
- `GET /api/lands` - Get all lands (public)
- `GET /api/lands/:id` - Get land basic details
- `GET /api/lands/:id/full` - Get full land details (requires auth)
- `GET /api/lands/search/radius` - Search lands by radius
- `POST /api/lands` - Create land (admin/agent only)
- `PUT /api/lands/:id` - Update land (admin/agent only)
- `DELETE /api/lands/:id` - Delete land (admin/agent only)

### Uploads
- `POST /api/upload/photos` - Upload land photos
- `POST /api/upload/documents` - Upload land documents

### Payments
- `POST /api/payment/create-subscription` - Create subscription order
- `POST /api/payment/create-site-order` - Create site purchase order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/access/:land_id` - Check land access

## Area Conversions

The platform uses Telangana standard conversions:
- 1 acre = 43,560 square feet
- 1 gunta = 1,089 square feet
- 1 square yard = 9 square feet

## Default Admin Credentials

- Email: admin@example.com
- Password: admin123

**IMPORTANT: Change the default admin password immediately after first login!**

## Color Palette

BhuDeals uses an earth-tone color scheme representing land and nature:

- **Deep Earth Green** (#2F4F32) - Primary brand color
- **Soil Brown** (#4D3D34) - Secondary text
- **Teal Dark** (#1F2F36) - Accent dark
- **Gold Highlight** (#C6AB62) - Premium features & CTAs
- **Fresh Green** (#90B77D) - Success & highlights
- **Sand Background** (#F4EFE2) - Page backgrounds
- **Primary Text** (#111111) - Main text
- **Secondary Grey** (#707070) - Muted text

## Security & Compliance

### Legal Framework
- Platform does not participate in transactions
- No brokerage or commission model
- All dealings between parties directly
- Transparent revenue model through digital services

### Data Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Secure file storage on AWS S3
- Environment variable protection

### User Privacy
- Minimal data collection
- Direct communication between parties
- No transaction data storage
- GDPR-compliant design

## Frequently Asked Questions

**Q: Does BhuDeals take commission or brokerage?**
A: No. BhuDeals does not participate in property transactions. All dealings are strictly between buyers, landowners, and agents.

**Q: How does BhuDeals earn revenue?**
A: Through premium listing boosts, agent subscriptions, and digital scouting services.

**Q: Can I contact sellers directly?**
A: Yes, all listings include direct contact details.

**Q: Are land details verified?**
A: Basic details are cross-checked for accuracy as shared by owners/agents.

**Q: What happens after I contact an agent or owner?**
A: All communication and transaction steps are handled directly between the concerned parties.

## Maintenance

### View Application Logs
```bash
pm2 logs bhudeals
```

### Restart Application
```bash
pm2 restart bhudeals
```

### Database Backup
```bash
pg_dump -U your_db_user bhudeals > backup_$(date +%Y%m%d).sql
```

### Monitor Performance
```bash
pm2 monit
```

### Update Application
```bash
git pull origin main
npm install
cd frontend && npm install && npm run build
pm2 restart bhudeals
```

## Nginx Configuration

The provided `nginx.conf` includes:
- Reverse proxy to Node.js backend
- Static file serving for Next.js
- SSL/TLS configuration
- Gzip compression
- Security headers
- Rate limiting

## Future Enhancements

- Mobile applications (iOS & Android)
- Advanced analytics for agents
- AI-powered land recommendations
- Virtual land tours (360° photos)
- Multi-language support
- Chatbot for instant support
- Integration with land registry systems
- Advanced filtering options
- Comparison tools
- Saved searches and alerts

## Support

For technical support, documentation, or business inquiries:
- Website: https://bhudeals.com
- Email: support@bhudeals.com
- Documentation: https://docs.bhudeals.com

## License

Proprietary - All rights reserved

---

**BhuDeals** - Discover Lands. Fast, Verified & Easy.
