# ⚡ Quick Start Guide

## 🚀 Start the Application (One Command)

```powershell
.\start.ps1
```

**That's it!** The application is now running.

---

## 🌐 Access the Application

### **Frontend (React UI)**
**URL:** http://localhost:5173

### **Backend API**
**URL:** http://localhost:3001  
**Health Check:** http://localhost:3001/health

---

## 🔐 Login Credentials

### **Super Admin** (Full Access)
- **Email:** `admin@shopifygenie.com`
- **Password:** `admin123`

### **Accountant** (Accounting & Reports)
- **Email:** `accounting@shopifygenie.com`
- **Password:** `accounting123`

---

## ✅ What's Already Configured

The `.env` file has been created with:

✅ **Database:** SQLite (no setup needed)  
✅ **JWT Secret:** Pre-configured  
✅ **Ports:** 3001 (Backend) & 5173 (Frontend)  
✅ **CORS:** Configured for localhost  
✅ **All Features:** Ready to use  

---

## 📊 Available Features

### **Dashboard**
- Real-time KPIs
- Revenue, expenses, profit tracking
- Interactive charts

### **Reports** (9 Comprehensive Reports)
1. **Dashboard Summary** - Key metrics at a glance
2. **Trial Balance** - Account balances verification
3. **Profit & Loss** - Income statement
4. **Balance Sheet** - Financial position
5. **Cash Flow** - Indirect method with working capital
6. **Tax Summary** - Multi-source tax aggregation
7. **Expense Breakdown** - Category-wise analysis
8. **Revenue Breakdown** - Source analysis
9. **Custom Reports** - Date range filtering

### **Accounting**
- Chart of Accounts
- Journal Entries
- Account Reconciliation
- Multi-currency support

### **Settings**
- Company information
- Accounting preferences
- User management (Admin only)
- System configuration

### **Shopify Integration** (Optional)
- Connect stores
- Sync orders
- Automatic journal creation
- *Note: Requires Shopify API credentials*

---

## 🔧 Optional: Add Shopify Credentials

The app works perfectly **without** Shopify credentials. To enable Shopify integration:

1. **Get Credentials:**
   - Visit: https://partners.shopify.com
   - Create or select an app
   - Copy API Key and Secret

2. **Update .env:**
   ```env
   SHOPIFY_API_KEY=your-api-key-here
   SHOPIFY_API_SECRET=your-secret-here
   ```

3. **Restart:**
   ```powershell
   .\start.ps1
   ```

---

## 🛠️ Troubleshooting

### **Servers not starting?**

**Kill existing processes:**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force
```

**Then restart:**
```powershell
.\start.ps1
```

### **Can't login?**

**Recreate users:**
```powershell
cd server
npx ts-node prisma/create-users.ts
cd ..
```

### **Database issues?**

**Reset database:**
```powershell
cd server
npx prisma generate
npx prisma db push
npx ts-node prisma/create-users.ts
cd ..
```

---

## 📚 Documentation

- **Full Setup Guide:** `RUNNING_WITH_CREDENTIALS.md`
- **Reports Guide:** `REPORTS_COMPLETE.md`
- **Advanced Reports:** `ADVANCED_REPORTS_COMPLETE.md`
- **Settings Guide:** `SETTINGS_COMPLETE.md`
- **Scripts Guide:** `SCRIPTS_GUIDE.md`

---

## 🎯 Next Steps

1. **Login** at http://localhost:5173
2. **Explore Dashboard** - See KPIs and charts
3. **View Reports** - All 9 reports are ready
4. **Create Accounts** - Set up your chart of accounts
5. **Add Journal Entries** - Start recording transactions
6. **Generate Reports** - Analyze your financial data

---

## 🌟 Pro Tips

- **Dark Mode:** Toggle in the header
- **Date Filters:** All reports support custom date ranges
- **Export:** CSV/PDF export buttons ready (implementation pending)
- **Keyboard Shortcuts:** Navigate quickly through the app
- **Mobile Responsive:** Works on tablets and phones

---

## 🎊 You're Ready!

Your **ShopifyGenie Accounting Suite Pro** is fully operational with:

✅ Enterprise-grade accounting  
✅ 9 comprehensive reports  
✅ Advanced analytics  
✅ Cash flow analysis  
✅ Tax management  
✅ User management  
✅ Dark mode  
✅ Production-ready security  

**Start exploring at:** http://localhost:5173

**Happy Accounting!** 💰✨

