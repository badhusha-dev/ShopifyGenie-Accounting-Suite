import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

// Layout components
import Layout from './components/Layout'
import AuthLayout from './components/AuthLayout'

// Pages
import Login from './pages/auth/Login'
import DashboardPro from './pages/DashboardPro'
import Accounts from './pages/accounting/Accounts'
import JournalEntries from './pages/accounting/JournalEntries'
import ShopifyStores from './pages/shopify/Stores'
import Orders from './pages/shopify/Orders'
import Reconciliation from './pages/reconciliation/Reconciliation'
import ReportsPro from './pages/reports/ReportsPro'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

// Protected route component
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      } />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPro />} />
        
        {/* Accounting routes */}
        <Route path="accounting">
          <Route path="accounts" element={<Accounts />} />
          <Route path="journal-entries" element={<JournalEntries />} />
        </Route>
        
        {/* Shopify routes */}
        <Route path="shopify">
          <Route path="stores" element={<ShopifyStores />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        
        {/* Reconciliation routes */}
        <Route path="reconciliation" element={<Reconciliation />} />
        
        {/* Reports routes */}
        <Route path="reports" element={<ReportsPro />} />
        
        {/* Settings */}
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
