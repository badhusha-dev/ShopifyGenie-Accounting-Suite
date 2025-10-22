# 🚀 ShopifyGenie Accounting Suite - Scripts Guide

Complete guide to all available scripts for running and managing the application.

---

## 📋 Quick Start Scripts

### **Windows (PowerShell)**

#### **First Time Setup**
```powershell
.\setup.ps1
```
Runs complete setup: installs dependencies, sets up database, creates users, and starts the app.

#### **Quick Start (After Setup)**
```powershell
.\start.ps1
```
Simply starts the application (use this for daily development).

---

### **Linux/Mac (Bash)**

#### **First Time Setup**
```bash
npm run install:all
cd server
npx prisma generate
npx prisma migrate dev
npx ts-node prisma/create-users.ts
cd ..
npm run dev
```

#### **Quick Start**
```bash
npm run dev
```

---

## 📦 Available NPM Scripts

### **Root Level Commands**

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | Starts both frontend and backend | **Main development command** |
| `npm run install:all` | Installs all workspace dependencies | Run once after cloning |
| `npm run build` | Builds all packages | For production deployment |
| `npm run test` | Runs all tests | Testing suite |
| `npm run lint` | Lints all code | Code quality check |

---

### **Server Commands** (run from `/server` directory)

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | Starts backend in dev mode | Auto-restarts on changes |
| `npm run build` | Builds TypeScript to JavaScript | Production build |
| `npm run start` | Starts production server | After build |
| `npx prisma generate` | Generates Prisma Client | After schema changes |
| `npx prisma migrate dev` | Runs database migrations | Updates database |
| `npx prisma studio` | Opens Prisma Studio | Database GUI |
| `npx ts-node prisma/create-users.ts` | Creates default users | Admin & accounting users |

---

### **Client Commands** (run from `/client` directory)

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | Starts Vite dev server | Frontend development |
| `npm run build` | Builds production bundle | Production build |
| `npm run preview` | Previews production build | Test production build |
| `npm run lint` | Lints frontend code | Code quality |

---

## 🔧 Common Tasks

### **1. First Time Setup**

**Windows:**
```powershell
.\setup.ps1
```

**Linux/Mac:**
```bash
# Install dependencies
npm run install:all

# Setup database
cd server
npx prisma generate
npx prisma migrate dev
npx ts-node prisma/create-users.ts
cd ..

# Start application
npm run dev
```

---

### **2. Daily Development**

**Windows:**
```powershell
.\start.ps1
```

**Linux/Mac:**
```bash
npm run dev
```

This starts:
- Frontend on http://localhost:5173
- Backend on http://localhost:3001

---

### **3. Reset Database**

```bash
cd server

# Delete database
Remove-Item prisma/dev.db  # Windows
rm prisma/dev.db           # Linux/Mac

# Re-run migrations
npx prisma migrate dev

# Recreate users
npx ts-node prisma/create-users.ts

cd ..
```

---

### **4. Add Database Changes**

```bash
cd server

# 1. Edit prisma/schema.prisma
# 2. Generate Prisma Client
npx prisma generate

# 3. Create migration
npx prisma migrate dev --name your_migration_name

# 4. Restart server (auto-restarts if using npm run dev)

cd ..
```

---

### **5. View Database**

```bash
cd server
npx prisma studio
```
Opens GUI at http://localhost:5555

---

### **6. Check Database Users**

```bash
cd server
npx ts-node check-user.ts
```

---

### **7. Production Build**

```bash
# Build all packages
npm run build

# Server will be in server/dist
# Client will be in client/dist

# Start production server
cd server
npm start
```

---

### **8. Docker Deployment**

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🐛 Troubleshooting Scripts

### **Clear Node Modules**

**Windows:**
```powershell
# Stop all Node processes
Get-Process -Name node | Stop-Process -Force

# Remove node_modules
Remove-Item -Recurse -Force node_modules, client\node_modules, server\node_modules, shared\node_modules

# Reinstall
npm run install:all
```

**Linux/Mac:**
```bash
# Stop all Node processes
pkill node

# Remove node_modules
rm -rf node_modules client/node_modules server/node_modules shared/node_modules

# Reinstall
npm run install:all
```

---

### **Fix Port Already in Use**

**Windows:**
```powershell
# Frontend (port 5173)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force

# Backend (port 3001)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

**Linux/Mac:**
```bash
# Frontend
lsof -ti:5173 | xargs kill -9

# Backend
lsof -ti:3001 | xargs kill -9
```

---

### **Fresh Start Script** (Nuclear Option)

```bash
# Stop all Node processes
Get-Process -Name node | Stop-Process -Force  # Windows
pkill node                                     # Linux/Mac

# Clean everything
rm -rf node_modules client/node_modules server/node_modules shared/node_modules
rm -rf server/prisma/dev.db
rm -rf client/dist server/dist

# Reinstall and setup
npm run install:all
cd server
npx prisma generate
npx prisma migrate dev
npx ts-node prisma/create-users.ts
cd ..

# Start
npm run dev
```

---

## 🔐 Default Login Credentials

After running setup scripts, use these credentials:

### **Admin Account (Full Access)**
```
Email:    admin@shopifygenie.com
Password: admin123
```

### **Accounting Account**
```
Email:    accounting@shopifygenie.com
Password: accounting123
```

---

## 📊 Useful Development Commands

### **Watch for Changes**
```bash
# Frontend auto-reloads (Vite)
# Backend auto-restarts (Nodemon)
# Just run: npm run dev
```

### **Format Code**
```bash
npm run format  # If configured
```

### **Run Tests**
```bash
npm test
```

### **Check TypeScript**
```bash
# Frontend
cd client
npx tsc --noEmit

# Backend
cd server
npx tsc --noEmit
```

---

## 🚀 Quick Reference

| Task | Windows | Linux/Mac |
|------|---------|-----------|
| **First Setup** | `.\setup.ps1` | See Linux/Mac setup above |
| **Start App** | `.\start.ps1` | `npm run dev` |
| **Stop App** | `Ctrl+C` | `Ctrl+C` |
| **View Database** | `cd server; npx prisma studio` | Same |
| **Reset DB** | Delete `server/prisma/dev.db` | Same |
| **Create Users** | `cd server; npx ts-node prisma/create-users.ts` | Same |

---

## 📝 Script Execution Tips

### **Windows PowerShell**

If you get "execution policy" errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Make Scripts Executable (Linux/Mac)**
```bash
chmod +x setup.sh start.sh
```

---

## 🎯 Recommended Workflow

### **Morning Routine**
```bash
1. Open terminal
2. Run: .\start.ps1 (Windows) or npm run dev (Linux/Mac)
3. Open browser: http://localhost:5173
4. Login with admin@shopifygenie.com / admin123
5. Start coding!
```

### **After Schema Changes**
```bash
1. Edit server/prisma/schema.prisma
2. cd server
3. npx prisma generate
4. npx prisma migrate dev --name description_of_change
5. Server auto-restarts
```

### **Before Committing**
```bash
1. npm run lint
2. npm test
3. git add .
4. git commit -m "message"
5. git push
```

---

## 🆘 Need Help?

If scripts aren't working:

1. **Check Node version**: `node --version` (Should be 18+)
2. **Check npm version**: `npm --version`
3. **Clear cache**: `npm cache clean --force`
4. **Fresh install**: Remove `node_modules` and run `npm run install:all`
5. **Check logs**: Look at terminal output for errors
6. **Database issues**: Delete `server/prisma/dev.db` and re-run migrations

---

## 📚 Additional Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com

---

*Scripts Guide Updated: October 22, 2025*  
*Version: 2.1.0 Enterprise Edition*

