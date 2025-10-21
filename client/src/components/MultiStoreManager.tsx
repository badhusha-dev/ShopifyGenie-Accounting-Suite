import { motion } from 'framer-motion'
import { Store, Plus, Settings, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import { AnimatedCard } from './AnimatedCard'

interface StoreData {
  id: string
  name: string
  domain: string
  status: 'active' | 'inactive'
  lastSync: string
  totalOrders: number
  revenue: number
}

const mockStores: StoreData[] = [
  {
    id: '1',
    name: 'Main Store',
    domain: 'mystore.myshopify.com',
    status: 'active',
    lastSync: '2 minutes ago',
    totalOrders: 1234,
    revenue: 125000
  },
  {
    id: '2',
    name: 'Second Store',
    domain: 'store2.myshopify.com',
    status: 'active',
    lastSync: '5 minutes ago',
    totalOrders: 856,
    revenue: 89000
  },
  {
    id: '3',
    name: 'Test Store',
    domain: 'test.myshopify.com',
    status: 'inactive',
    lastSync: '2 days ago',
    totalOrders: 45,
    revenue: 3200
  }
]

export function MultiStoreManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Multi-Store Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all your Shopify stores in one place
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Store
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockStores.map((store, index) => (
          <AnimatedCard key={store.id} delay={index * 0.1} className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                      <Store className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {store.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {store.domain}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Settings className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-4">
                  {store.status === 'active' ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Active
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        Inactive
                      </span>
                    </>
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                    Last sync: {store.lastSync}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Orders</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {store.totalOrders.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${(store.revenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  View Details
                </motion.button>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  )
}

