# 🧞‍♂️ ShopifyGenie Accounting Suite Pro - Enterprise Edition

> **Shopify + Accounting. Reinvented.** 🚀

A full-featured, enterprise-grade accounting platform seamlessly integrated with Shopify. Built with modern technologies and designed for scalability, compliance, and beautiful user experience.

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/badhusha-dev/ShopifyGenie-Accounting-Suite)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## ✨ Features

### 🎨 **Pro UI/UX Features**
- 🧞‍♂️ **Professional Logo & Branding** - Custom-designed logo system with light/dark variants
- 🌙 **Dark Mode** - Seamless theme switching with persistence
- ✨ **Framer Motion Animations** - Smooth, modern UI transitions
- 🤖 **AI Assistant** - Intelligent financial insights (modular, API-ready)
- 📊 **Advanced Analytics** - Interactive Recharts dashboards
- 🏪 **Multi-Store Management** - Animated store cards and metrics
- 🔔 **Rich Notifications** - Toast system with Sonner
- 📁 **Report Export** - CSV, PDF, Excel ready

### 💼 **Enterprise Accounting Features**
- 📘 **AR Subledger** - Complete accounts receivable management
- 📙 **AP Subledger** - Full accounts payable tracking
- 💰 **Cash Flow Statement** - Automated operating/investing/financing activities
- 🏢 **Fixed Assets** - Asset register with depreciation automation
- 📊 **Budget vs Actual** - Variance tracking and analysis
- 📦 **Inventory Valuation** - FIFO & Weighted Average methods
- 💱 **Multi-Currency** - FX revaluation and gains/losses
- 🔍 **Audit Trail** - Complete change tracking for compliance
- 🔒 **Period Locking** - Financial period security
- 🌐 **Consolidated Financials** - Multi-store consolidation
- 📈 **KPI Dashboard** - Real-time metrics and trends

### 🔧 **Core Accounting**
- ✅ Double-entry accounting system
- ✅ Chart of Accounts (COA)
- ✅ Journal entries (manual & automated)
- ✅ Trial Balance
- ✅ Profit & Loss Statement
- ✅ Balance Sheet
- ✅ Tax reporting & summaries
- ✅ Bank reconciliation
- ✅ Multi-currency support

### 🛍️ **Shopify Integration**
- ✅ OAuth 2.0 authentication
- ✅ Order sync & automation
- ✅ Refund tracking
- ✅ Payout reconciliation
- ✅ Webhook support
- ✅ Multi-store management

---

## 📊 Stats

- **38 Total Features** (Pro + Enterprise)
- **15 Advanced API Endpoints**
- **13 New Database Models**
- **1,500+ Lines of Production Code**
- **7 Comprehensive Documentation Files**
- **35+ Total API Endpoints**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ & npm
- Git
- (Optional) Docker & Docker Compose

### Installation

```bash
# Clone the repository
git clone git@github.com:badhusha-dev/ShopifyGenie-Accounting-Suite.git
cd ShopifyGenie-Accounting-Suite

# Install all dependencies
npm run install:all

# Copy environment variables
cp env.example .env

# Edit .env with your configuration
# Required: DATABASE_URL, JWT_SECRET
# Optional: SHOPIFY_API_KEY, SHOPIFY_API_SECRET

# Set up database
cd server
npx prisma generate
npx prisma migrate dev

# Start development servers
cd ..
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Login**: admin@shopifygenie.com / admin123

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive charts
- **Radix UI** - Accessible components
- **Sonner** - Toast notifications
- **TanStack Query** - Data fetching

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database toolkit
- **SQLite/PostgreSQL** - Database
- **Winston** - Logging
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy
- **Git** - Version control

---

## 📚 Documentation

### Getting Started
- [Quick Start Guide](QUICK_START_PRO.md) - Get up and running in 5 minutes
- [Getting Started](docs/GETTING_STARTED.md) - Detailed setup instructions

### Features & Guides
- [Pro Features](PRO_UPGRADE_COMPLETE.md) - UI/UX enhancements guide
- [Enterprise Features](ENTERPRISE_FEATURES_COMPLETE.md) - Advanced accounting features
- [Advanced Features Guide](ADVANCED_FEATURES_GUIDE.md) - Technical reference
- [Logo & Branding](LOGO_BRANDING_GUIDE.md) - Brand guidelines

### Status & Reports
- [Final Status Report](FINAL_STATUS_REPORT.md) - Complete implementation summary
- [Project Complete](PROJECT_COMPLETE.md) - Original completion report
- [Backend Status](BACKEND_COMPLETE.md) - Backend implementation details

---

## 🎯 Use Cases

### For Small Businesses
- Sync Shopify orders automatically
- Track revenue and expenses
- Generate financial reports
- Manage cash flow
- Handle tax reporting

### For Accountants
- Complete AR/AP management
- Budget tracking and variance analysis
- Fixed asset depreciation
- Multi-store consolidation
- Full audit trail

### For Enterprises
- Multi-currency operations
- Inventory valuation (FIFO/Weighted Avg)
- FX revaluation
- KPI dashboards
- Consolidated financials
- Period locking for compliance

---

## 🔐 Security

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-Based Access Control** - SUPER_ADMIN, ACCOUNTING, SHOPIFY_MANAGER, AUDITOR
- ✅ **Password Hashing** - bcryptjs encryption
- ✅ **Environment Variables** - Sensitive data protection
- ✅ **Rate Limiting** - API abuse prevention
- ✅ **CORS** - Cross-origin security
- ✅ **Audit Logging** - Complete change tracking

---

## 📈 API Endpoints

### Advanced Reports
```typescript
GET /api/reports/advanced/cashflow              // Cash flow statement
GET /api/reports/advanced/ar-aging              // AR aging report
GET /api/reports/advanced/ap-aging              // AP aging report
GET /api/reports/advanced/budget-variance       // Budget vs actual
GET /api/reports/advanced/fixed-assets          // Asset register
GET /api/reports/advanced/inventory-valuation   // Inventory valuation
GET /api/reports/advanced/fx-revaluation        // FX gains/losses
GET /api/reports/advanced/consolidated          // Multi-store consolidation
GET /api/reports/advanced/audit-trail           // Audit log
```

### KPI Dashboard
```typescript
GET /api/reports/advanced/kpi-summary     // Revenue, margins, orders
GET /api/reports/advanced/sales-trends    // Time-series sales
GET /api/reports/advanced/top-products    // Top products by revenue
```

### Core Accounting
```typescript
GET  /api/accounting/accounts             // Chart of accounts
POST /api/accounting/journal-entries      // Create journal entry
GET  /api/reports/trial-balance           // Trial balance
GET  /api/reports/profit-loss             // P&L statement
GET  /api/reports/balance-sheet           // Balance sheet
```

[View Complete API Documentation](server/API_STATUS.md)

---

## 🎨 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x450?text=ShopifyGenie+Dashboard)

### Dark Mode
![Dark Mode](https://via.placeholder.com/800x450?text=Dark+Mode+Theme)

### KPI Analytics
![Analytics](https://via.placeholder.com/800x450?text=Advanced+Analytics)

---

## 🚢 Deployment

### Docker (Recommended)
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment
```bash
# Build frontend
cd client
npm run build

# Build backend
cd ../server
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Shopify Admin API](https://shopify.dev/docs/api/admin) - E-commerce integration
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Recharts](https://recharts.org/) - Chart library

---

## 📞 Support

- 📧 Email: support@shopifygenie.com
- 💬 Issues: [GitHub Issues](https://github.com/badhusha-dev/ShopifyGenie-Accounting-Suite/issues)
- 📚 Docs: [Documentation](docs/)

---

## 🗺️ Roadmap

### v2.2.0 (Q1 2026)
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Advanced AI insights
- [ ] Automated bank feeds
- [ ] Payroll integration

### v3.0.0 (Q2 2026)
- [ ] Multi-tenant SaaS
- [ ] White-label support
- [ ] Advanced forecasting
- [ ] Machine learning predictions
- [ ] Blockchain integration

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=badhusha-dev/ShopifyGenie-Accounting-Suite&type=Date)](https://star-history.com/#badhusha-dev/ShopifyGenie-Accounting-Suite&Date)

---

<div align="center">

**Made with ❤️ by the ShopifyGenie Team**

[Website](https://shopifygenie.com) • [Documentation](docs/) • [Support](mailto:support@shopifygenie.com)

**Shopify + Accounting. Reinvented.** 🚀

</div>
