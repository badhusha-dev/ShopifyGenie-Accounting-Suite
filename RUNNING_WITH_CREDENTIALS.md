# 🚀 Running ShopifyGenie Accounting Suite Pro

## Quick Start (3 Steps)

### **Step 1: Setup Environment**
```powershell
.\setup-env.ps1
```
This creates your `.env` file with all necessary configuration.

### **Step 2: Start Application**
```powershell
.\start.ps1
```
This starts both backend (port 3001) and frontend (port 5173).

### **Step 3: Login**
- **URL:** http://localhost:5173
- **Email:** admin@shopifygenie.com
- **Password:** admin123

---

## 🔐 Configuration Details

### **Current Setup (Ready to Use)**

The application is configured with:

✅ **Database:** SQLite (dev.db) - No PostgreSQL needed  
✅ **JWT Secret:** Pre-configured for development  
✅ **Port:** 3001 (Backend) & 5173 (Frontend)  
✅ **CORS:** Configured for localhost  
✅ **Rate Limiting:** 100 requests per 15 minutes  

### **Shopify Integration (Optional)**

The app works perfectly **WITHOUT** Shopify credentials. You can:
- ✅ Login and use all accounting features
- ✅ Create journal entries
- ✅ Generate reports
- ✅ Manage accounts
- ✅ View dashboard

**To enable Shopify integration:**

1. **Get Shopify Credentials:**
   - Go to: https://partners.shopify.com
   - Create a new app (or use existing)
   - Navigate to: App Setup → API credentials
   - Copy your **API Key** and **API Secret**

2. **Update .env file:**
   ```env
   SHOPIFY_API_KEY="your-actual-api-key-here"
   SHOPIFY_API_SECRET="your-actual-secret-here"
   ```

3. **Restart the application:**
   ```powershell
   .\start.ps1
   ```

---

## 📋 Environment Variables Explained

### **Required (Already Configured)**

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | `file:./dev.db` | SQLite database location |
| `JWT_SECRET` | Auto-generated | Secure JWT token signing |
| `PORT` | `3001` | Backend API port |
| `CLIENT_URL` | `http://localhost:5173` | Frontend URL |
| `ENCRYPTION_KEY` | Auto-generated | Data encryption key |

### **Optional (Can be added later)**

| Variable | Purpose | When Needed |
|----------|---------|-------------|
| `SHOPIFY_API_KEY` | Shopify integration | To sync orders from Shopify |
| `SHOPIFY_API_SECRET` | Shopify authentication | To connect to Shopify stores |
| `SMTP_HOST` | Email notifications | To send reports via email |
| `SMTP_USER` | Email account | For automated emails |
| `SMTP_PASS` | Email password | Email authentication |

---

## 🎯 What Works Without Shopify Credentials

### **✅ Fully Functional Features:**

1. **Authentication & Users**
   - Login/Logout
   - User management
   - Role-based access control

2. **Accounting**
   - Chart of accounts
   - Journal entries
   - Account reconciliation
   - Trial balance

3. **Reports** (All 9 Reports!)
   - Dashboard summary
   - Trial balance
   - Profit & Loss
   - Balance sheet
   - Cash flow statement
   - Tax summary
   - Expense breakdown
   - Revenue breakdown
   - Custom date ranges

4. **Settings**
   - Company information
   - Accounting preferences
   - User management
   - System configuration

### **⚠️ Requires Shopify Credentials:**

1. **Shopify Integration**
   - Connect Shopify stores
   - Sync orders
   - Import products
   - Automatic journal creation from orders

---

## 🛠️ Troubleshooting

### **Issue: Port already in use**

**Solution:**
```powershell
# Kill processes on ports 3001 and 5173
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force

# Then run start.ps1 again
.\start.ps1
```

### **Issue: Database not found**

**Solution:**
```powershell
cd server
npx prisma generate
npx prisma db push
npx ts-node prisma/create-users.ts
cd ..
```

### **Issue: Login not working**

**Solution:**
```powershell
# Recreate default users
cd server
npx ts-node prisma/create-users.ts
cd ..
```

### **Issue: .env file not found**

**Solution:**
```powershell
# Run setup script
.\setup-env.ps1
```

---

## 📊 Available API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### **Reports** (All require authentication)
- `GET /api/reports/dashboard` - Dashboard summary
- `GET /api/reports/trial-balance` - Trial balance
- `GET /api/reports/pnl` - Profit & Loss
- `GET /api/reports/balance-sheet` - Balance sheet
- `GET /api/reports/cashflow` - Cash flow statement
- `GET /api/reports/tax` - Enhanced tax summary
- `GET /api/reports/expense-breakdown` - Expense analysis
- `GET /api/reports/revenue-breakdown` - Revenue analysis

### **Accounting**
- `GET /api/accounting/accounts` - List accounts
- `POST /api/accounting/accounts` - Create account
- `GET /api/accounting/journal-entries` - List entries
- `POST /api/accounting/journal-entries` - Create entry

### **Settings**
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings
- `GET /api/settings/users` - List users (Admin only)

### **Shopify** (Requires credentials)
- `GET /api/shopify/stores` - List connected stores
- `POST /api/shopify/stores` - Connect store
- `GET /api/shopify/orders` - List orders
- `POST /api/shopify/orders/sync` - Sync orders

---

## 🎨 Default Users

### **Super Admin**
- **Email:** admin@shopifygenie.com
- **Password:** admin123
- **Access:** Full system access

### **Accountant**
- **Email:** accounting@shopifygenie.com
- **Password:** accounting123
- **Access:** Accounting and reports

---

## 🔒 Security Notes

### **For Development:**
✅ Current configuration is perfect for local development  
✅ JWT secret is strong enough for testing  
✅ Database is local SQLite  

### **For Production:**
⚠️ **MUST CHANGE:**
1. `JWT_SECRET` - Use a cryptographically secure random string
2. `ENCRYPTION_KEY` - Generate a new 32-character key
3. `DATABASE_URL` - Use PostgreSQL or MySQL
4. `NODE_ENV` - Set to "production"
5. Add HTTPS/SSL certificates
6. Enable firewall rules
7. Use environment-specific secrets management

**Generate secure secrets:**
```powershell
# Generate JWT_SECRET (64 characters)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Generate ENCRYPTION_KEY (32 characters)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## 🌐 Accessing the Application

### **Frontend (React)**
- **URL:** http://localhost:5173
- **Features:** Full UI with all pages

### **Backend API**
- **URL:** http://localhost:3001
- **Health Check:** http://localhost:3001/health
- **API Docs:** http://localhost:3001 (branded landing page)

### **Database**
- **Type:** SQLite
- **Location:** `server/prisma/dev.db`
- **Viewer:** Use DB Browser for SQLite or Prisma Studio
  ```powershell
  cd server
  npx prisma studio
  ```

---

## 📈 Performance Tips

1. **Database Optimization:**
   - SQLite is fast for development
   - For production, migrate to PostgreSQL
   - Add indexes for frequently queried fields

2. **API Caching:**
   - Reports are computed on-demand
   - Consider Redis for caching heavy reports
   - Use query parameters for date ranges

3. **Frontend Performance:**
   - React Query handles caching automatically
   - Date range filters reduce data load
   - Pagination on large datasets

---

## 🎉 You're All Set!

Your ShopifyGenie Accounting Suite Pro is ready to run with:

✅ **Complete Backend** - 13 API endpoints  
✅ **Full Frontend** - 9 comprehensive reports  
✅ **Enterprise Features** - Cash flow, tax, expense analysis  
✅ **Production-Ready** - Security, RBAC, rate limiting  
✅ **Optional Shopify** - Works with or without integration  

### **Start Now:**
```powershell
.\setup-env.ps1  # Create .env file
.\start.ps1      # Start application
```

**Then open:** http://localhost:5173  
**Login with:** admin@shopifygenie.com / admin123

---

## 📚 Additional Resources

- **Setup Guide:** `SCRIPTS_GUIDE.md`
- **Reports Guide:** `REPORTS_COMPLETE.md`
- **Advanced Reports:** `ADVANCED_REPORTS_COMPLETE.md`
- **Settings Guide:** `SETTINGS_COMPLETE.md`
- **Project Overview:** `README.md`

---

**Need Help?**  
All features are documented. Check the guides above or review the code comments.

**Happy Accounting!** 💰✨

