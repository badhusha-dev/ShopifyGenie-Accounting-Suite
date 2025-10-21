# ShopifyGenie Accounting Suite Pro

> **Shopify + Accounting. Reinvented.** ✨

An upgraded, feature-rich Shopify integration app with advanced analytics, AI assistant, dark mode, and beautiful animations. Syncs Shopify store data into a complete double-entry accounting system with modern UI/UX. Built with React 18, Framer Motion, Express, TypeScript, and Prisma ORM.

## 🚀 Features

### Core Modules
- **🔐 Authentication & Roles** - JWT-based auth with role-based access control
- **🛍️ Shopify Integration** - OAuth 2.0, webhooks, and multi-store data synchronization
- **📊 Accounting Engine** - True double-entry journal system with chart of accounts
- **🔄 Reconciliation** - Automated payout matching and manual reconciliation
- **📈 Advanced Reports** - Interactive reports with PDF/Excel/CSV export
- **👨‍💼 Pro Dashboard** - Animated dashboard with advanced analytics
- **🌙 Dark Mode** - Full dark mode support with smooth transitions
- **🤖 AI Assistant** - Modular AI chat for financial insights (OpenAI/Gemini ready)
- **📊 Analytics** - Interactive charts (Area, Bar, Line, Pie) with Recharts
- **✨ Animations** - Framer Motion powered smooth animations and transitions

### User Roles
- **Super Admin** - Full system access
- **Accounting** - Financial data and reports
- **Shopify Manager** - Store integration and sync
- **Auditor** - Read-only access to all data

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite/PostgreSQL with Prisma ORM
- **Authentication:** JWT + Role-based access control
- **Integration:** Shopify Admin API 2025-07
- **UI Components:** Radix UI + Custom Animated Components
- **Charts:** Recharts for interactive data visualization
- **Notifications:** Sonner toast notifications
- **Deployment:** Docker + Docker Compose

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL 15+
- Docker and Docker Compose (optional)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd shopifygenie-accounting
npm run install:all
```

### 2. Environment Setup
```bash
cp env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
```bash
npm run db:generate
npm run db:push
```

### 4. Start Development
```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Database:** localhost:5432

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d postgres redis
npm run dev
```

### Production
```bash
docker-compose up -d
```

## 📁 Project Structure

```
shopifygenie-accounting/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Prisma models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   ├── prisma/            # Database schema
│   └── package.json
├── shared/                 # Shared types and utilities
├── docs/                   # Documentation
├── docker-compose.yml      # Docker configuration
└── package.json           # Root package.json
```

## 🔧 Configuration

### Shopify App Setup
1. Create a Shopify Partner account
2. Create a new app with required scopes:
   - `read_orders`
   - `read_products`
   - `read_customers`
   - `read_inventory`
   - `read_refunds`
   - `shopify_payments_payouts`
3. Configure webhook endpoints
4. Update `.env` with your app credentials

### Database Configuration
The app uses PostgreSQL with Prisma ORM. Key models include:
- **User & Role Management**
- **Chart of Accounts**
- **Journal Entries & Lines**
- **Shopify Data (Orders, Products, Refunds, Payouts)**
- **Reconciliation Matches**

## 📊 Accounting Features

### Double-Entry System
- Automatic journal entry creation from Shopify events
- Configurable posting rules for different transaction types
- Multi-currency support with FX rate tracking
- Tax management per jurisdiction

### Reconciliation
- Automated matching of Shopify payouts to orders
- Manual reconciliation interface
- Exception handling for unmatched transactions

### Reports
- **Trial Balance** - Account balances and totals
- **Profit & Loss** - Revenue, COGS, and expenses
- **Balance Sheet** - Assets, liabilities, and equity
- **Tax Summary** - Tax collected and owed by jurisdiction

## 🔐 Security

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Encrypted Shopify token storage
- Webhook HMAC validation

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:server   # Backend tests
npm run test:client   # Frontend tests
```

## 📝 API Documentation

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### Shopify Integration
- `GET /shopify/install` - OAuth installation
- `GET /shopify/callback` - OAuth callback
- `POST /shopify/webhooks/*` - Webhook endpoints
- `POST /shopify/sync` - Manual data sync

### Accounting
- `GET /accounting/accounts` - Chart of accounts
- `POST /accounting/journals` - Create journal entry
- `GET /accounting/journals` - List journal entries

### Reports
- `GET /reports/trial-balance` - Trial balance report
- `GET /reports/pnl` - Profit & loss report
- `GET /reports/balance-sheet` - Balance sheet report

## 🚀 Deployment

### Environment Variables
Copy `env.example` to `.env` and configure:
- Database connection
- JWT secrets
- Shopify app credentials
- Email configuration (optional)

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure email notifications
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the API documentation

---

**ShopifyGenie Accounting Suite** - Making Shopify accounting simple and powerful! 🚀
