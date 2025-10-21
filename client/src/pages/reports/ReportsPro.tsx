import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Filter
} from 'lucide-react'
import { PageTransition } from '../../components/PageTransition'
import { AnimatedCard } from '../../components/AnimatedCard'
import { toast } from 'sonner'

type ReportType = 'trial-balance' | 'pnl' | 'balance-sheet' | 'tax-summary'

interface Report {
  id: ReportType
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const reports: Report[] = [
  {
    id: 'trial-balance',
    name: 'Trial Balance',
    description: 'Account balances and totals',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'pnl',
    name: 'Profit & Loss',
    description: 'Revenue, COGS, and expenses',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'balance-sheet',
    name: 'Balance Sheet',
    description: 'Assets, liabilities, and equity',
    icon: DollarSign,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'tax-summary',
    name: 'Tax Summary',
    description: 'Tax collected by jurisdiction',
    icon: FileText,
    color: 'from-orange-500 to-red-500'
  }
]

export default function ReportsPro() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const handleExport = (reportId: ReportType, format: 'pdf' | 'excel' | 'csv') => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `Generating ${format.toUpperCase()} report...`,
        success: `${reportId} exported successfully as ${format.toUpperCase()}!`,
        error: 'Export failed'
      }
    )
  }

  const handleGenerate = (reportId: ReportType) => {
    toast.success(`Generating ${reportId} report...`)
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Financial Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Generate and export comprehensive financial reports
            </p>
          </div>
          
          {/* Period Selector */}
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </motion.div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <AnimatedCard key={report.id} delay={index * 0.1}>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${report.color} p-6`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                      <report.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-white">
                      <h3 className="text-xl font-bold">{report.name}</h3>
                      <p className="text-white/80 text-sm">{report.description}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Preview Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Period</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                        {selectedPeriod}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last Generated</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        2 hours ago
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGenerate(report.id)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      <FileText className="h-4 w-4 inline mr-2" />
                      Generate Report
                    </motion.button>

                    {/* Export Options */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleExport(report.id, 'pdf')}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        <Download className="h-3 w-3 inline mr-1" />
                        PDF
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleExport(report.id, 'excel')}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        <Download className="h-3 w-3 inline mr-1" />
                        Excel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleExport(report.id, 'csv')}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        <Download className="h-3 w-3 inline mr-1" />
                        CSV
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Quick Filters */}
        <AnimatedCard delay={0.5}>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Advanced Filters
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Types</option>
                  <option>Assets</option>
                  <option>Liabilities</option>
                  <option>Revenue</option>
                  <option>Expenses</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Store
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Stores</option>
                  <option>Main Store</option>
                  <option>Second Store</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </PageTransition>
  )
}

