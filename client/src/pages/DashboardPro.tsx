import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  RefreshCw,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import { reportsService } from '../services/reportsService'
import { AnimatedStatCard } from '../components/AnimatedCard'
import { AdvancedAnalytics } from '../components/AdvancedAnalytics'
import { AIAssistant } from '../components/AIAssistant'
import { PageTransition } from '../components/PageTransition'
import { toast } from 'sonner'

export default function DashboardPro() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: reportsService.getDashboardStats,
  })

  const statCards = [
    {
      name: 'Total Revenue',
      value: `$${(stats?.data?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Orders',
      value: stats?.data?.totalOrders || 0,
      icon: ShoppingCart,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Customers',
      value: stats?.data?.totalCustomers || 0,
      icon: Users,
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      name: 'Pending Reconciliation',
      value: stats?.data?.pendingReconciliation || 0,
      icon: RefreshCw,
      change: '-3%',
      changeType: 'negative' as const,
    },
  ]

  const handleSync = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Syncing Shopify data...',
        success: 'Shopify data synced successfully!',
        error: 'Failed to sync data',
      }
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">
              Welcome to ShopifyGenie Accounting Suite Pro
            </h1>
            <p className="text-indigo-100 text-lg">
              Shopify + Accounting. Reinvented. ✨
            </p>
          </div>
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear" 
            }}
            className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "linear" 
            }}
            className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full"
          />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <AnimatedStatCard
              key={stat.name}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSync}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Shopify Data
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg transition-all"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Create Journal Entry
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg transition-all"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Reports
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Advanced Analytics */}
        <AdvancedAnalytics />

        {/* AI Assistant */}
        <AIAssistant />
      </div>
    </PageTransition>
  )
}

