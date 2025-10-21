# Getting Started with ShopifyGenie Accounting Suite

## Quick Start Guide

### Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL 15+
- Docker and Docker Compose (optional)

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd shopifygenie-accounting

# Install all dependencies
npm run install:all
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
# Required variables:
# - DATABASE_URL
# - JWT_SECRET
# - SHOPIFY_API_KEY
# - SHOPIFY_API_SECRET
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with initial data
npm run db:seed
```

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:client  # Frontend on http://localhost:5173
npm run dev:server  # Backend on http://localhost:3001
```

### 5. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## Default Login Credentials

- **Admin:** admin@shopifygenie.com / admin123
- **Accounting:** accounting@shopifygenie.com / accounting123

## Shopify App Setup

### 1. Create Shopify Partner Account

1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Create a new app
3. Configure the following settings:

### 2. App Configuration

**App URL:** `http://localhost:3001/api/shopify/install`
**Allowed redirection URL(s):** `http://localhost:3001/api/shopify/callback`

**Required Scopes:**
- `read_orders`
- `read_products`
- `read_customers`
- `read_inventory`
- `read_refunds`
- `shopify_payments_payouts`

### 3. Webhook Configuration

Configure the following webhook endpoints:
- `orders/paid` → `http://localhost:3001/api/shopify/webhooks/orders-paid`
- `orders/fulfilled` → `http://localhost:3001/api/shopify/webhooks/orders-fulfilled`
- `refunds/create` → `http://localhost:3001/api/shopify/webhooks/refunds-create`

### 4. Update Environment Variables

```env
SHOPIFY_API_KEY=your_app_api_key
SHOPIFY_API_SECRET=your_app_secret
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
```

## Docker Deployment

### Development

```bash
# Start only database and Redis
docker-compose up -d postgres redis

# Run application locally
npm run dev
```

### Production

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Project Structure

```
shopifygenie-accounting/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # State management (Zustand)
│   │   └── utils/         # Utilities
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   ├── prisma/            # Database schema
│   └── package.json
├── shared/                 # Shared types and utilities
├── docs/                   # Documentation
└── docker-compose.yml      # Docker configuration
```

## Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Super Admin, Accounting, Shopify Manager, Auditor)
- Secure password handling with bcrypt

### 🛍️ Shopify Integration
- OAuth 2.0 installation flow
- Webhook handling for real-time updates
- Data synchronization (Orders, Products, Refunds, Payouts)
- Encrypted token storage

### 📊 Accounting Engine
- True double-entry journal system
- Chart of Accounts management
- Automatic journal entry creation from Shopify events
- Multi-currency support

### 🔄 Reconciliation
- Automated payout matching
- Manual reconciliation interface
- Exception handling for unmatched transactions

### 📈 Reports
- Trial Balance
- Profit & Loss Statement
- Balance Sheet
- Tax Summary

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Shopify Integration
- `GET /api/shopify/install` - OAuth installation
- `GET /api/shopify/callback` - OAuth callback
- `POST /api/shopify/sync` - Manual data sync
- `POST /api/shopify/webhooks/*` - Webhook endpoints

### Accounting
- `GET /api/accounting/accounts` - Chart of accounts
- `POST /api/accounting/journals` - Create journal entry
- `GET /api/accounting/journals` - List journal entries

### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/trial-balance` - Trial balance report
- `GET /api/reports/pnl` - Profit & loss report
- `GET /api/reports/balance-sheet` - Balance sheet report

## Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Reset database
npm run db:push
```

**Shopify Webhook Issues:**
- Verify webhook URLs are accessible
- Check webhook secret configuration
- Ensure HTTPS in production

**Build Errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Logs

**Development:**
- Backend logs: Console output
- Frontend logs: Browser console

**Production:**
```bash
# View Docker logs
docker-compose logs -f server
docker-compose logs -f client
```

## Support

For issues and questions:
1. Check the documentation in `/docs`
2. Review the API documentation
3. Create an issue in the repository

---

**ShopifyGenie Accounting Suite** - Making Shopify accounting simple and powerful! 🚀
