import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reportsService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  BarChart3,
  FileText,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  TrendingDown,
  Activity,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { toast } from 'sonner';

type TabId = 'dashboard' | 'trial' | 'pnl' | 'balance' | 'tax';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof BarChart3;
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'trial', label: 'Trial Balance', icon: BarChart3 },
  { id: 'pnl', label: 'Profit & Loss', icon: TrendingUp },
  { id: 'balance', label: 'Balance Sheet', icon: FileText },
  { id: 'tax', label: 'Tax Summary', icon: DollarSign },
];

const COLORS = ['#4F46E5', '#22C55E', '#EAB308', '#F97316', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ReportsPro() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [dateRange, setDateRange] = useState('last30');

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: reportsService.getDashboard,
  });

  // Fetch trial balance
  const { data: trialBalanceData, isLoading: isTrialLoading } = useQuery({
    queryKey: ['trial-balance'],
    queryFn: () => reportsService.getTrialBalance(),
    enabled: activeTab === 'trial',
  });

  // Fetch profit & loss
  const { data: pnlData, isLoading: isPnlLoading } = useQuery({
    queryKey: ['profit-loss'],
    queryFn: () => reportsService.getProfitLoss(),
    enabled: activeTab === 'pnl',
  });

  // Fetch balance sheet
  const { data: balanceSheetData, isLoading: isBalanceLoading } = useQuery({
    queryKey: ['balance-sheet'],
    queryFn: () => reportsService.getBalanceSheet(),
    enabled: activeTab === 'balance',
  });

  // Fetch tax summary
  const { data: taxData, isLoading: isTaxLoading } = useQuery({
    queryKey: ['tax-summary'],
    queryFn: () => reportsService.getTaxSummary(),
    enabled: activeTab === 'tax',
  });

  const handleExport = (format: 'csv' | 'pdf') => {
    toast.success(`Exporting ${activeTab} as ${format.toUpperCase()}...`);
    // TODO: Implement actual export logic
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            Financial Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive financial reporting and analytics
          </p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            PDF
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group relative py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      isActive
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                    {tab.label}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeReportTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {isDashboardLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Activity className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    <>
                      {/* KPI Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium opacity-90">Total Revenue</p>
                              <p className="text-2xl font-bold mt-2">
                                {formatCurrency(dashboardData?.totalRevenue || 0)}
                              </p>
                            </div>
                            <TrendingUp className="w-12 h-12 opacity-50" />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium opacity-90">Total Expenses</p>
                              <p className="text-2xl font-bold mt-2">
                                {formatCurrency(dashboardData?.totalExpenses || 0)}
                              </p>
                            </div>
                            <TrendingDown className="w-12 h-12 opacity-50" />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium opacity-90">Net Income</p>
                              <p className="text-2xl font-bold mt-2">
                                {formatCurrency(dashboardData?.netIncome || 0)}
                              </p>
                            </div>
                            <DollarSign className="w-12 h-12 opacity-50" />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium opacity-90">Total Assets</p>
                              <p className="text-2xl font-bold mt-2">
                                {formatCurrency(dashboardData?.totalAssets || 0)}
                              </p>
                            </div>
                            <Activity className="w-12 h-12 opacity-50" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Charts */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Revenue vs Expenses
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={[
                                {
                                  name: 'Financial Overview',
                                  Revenue: dashboardData?.totalRevenue || 0,
                                  Expenses: dashboardData?.totalExpenses || 0,
                                  Profit: dashboardData?.netIncome || 0,
                                },
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                              <Legend />
                              <Bar dataKey="Revenue" fill="#22C55E" />
                              <Bar dataKey="Expenses" fill="#EF4444" />
                              <Bar dataKey="Profit" fill="#4F46E5" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Financial Position
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Assets', value: dashboardData?.totalAssets || 0 },
                                  { name: 'Liabilities', value: dashboardData?.totalLiabilities || 0 },
                                  { name: 'Equity', value: dashboardData?.totalEquity || 0 },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {[0, 1, 2].map((index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Trial Balance Tab */}
              {activeTab === 'trial' && (
                <div className="space-y-4">
                  {isTrialLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Activity className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Account Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Account Name
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Debit
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Credit
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Balance
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {trialBalanceData?.trialBalance?.map((item: any) => (
                            <tr key={item.accountId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {item.accountCode}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {item.accountName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                {formatCurrency(item.debit)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                {formatCurrency(item.credit)}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                                item.balance >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatCurrency(item.balance)}
                              </td>
                            </tr>
                          ))}
                          {/* Totals Row */}
                          <tr className="bg-gray-100 dark:bg-gray-800 font-bold">
                            <td colSpan={2} className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              TOTAL
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white">
                              {formatCurrency(trialBalanceData?.totals?.totalDebits || 0)}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white">
                              {formatCurrency(trialBalanceData?.totals?.totalCredits || 0)}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white">
                              {formatCurrency(trialBalanceData?.totals?.difference || 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* P&L Tab */}
              {activeTab === 'pnl' && (
                <div className="space-y-6">
                  {isPnlLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Activity className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Section */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-green-600 mb-4">Revenue</h3>
                          <div className="space-y-2">
                            {pnlData?.revenue?.accounts?.map((account: any) => (
                              <div key={account.accountId} className="flex justify-between items-center">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {account.accountName}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {formatCurrency(account.amount)}
                                </span>
                              </div>
                            ))}
                            <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                              <div className="flex justify-between items-center font-bold">
                                <span className="text-gray-900 dark:text-white">Total Revenue</span>
                                <span className="text-green-600">
                                  {formatCurrency(pnlData?.revenue?.total || 0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expenses Section */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-red-600 mb-4">Expenses</h3>
                          <div className="space-y-2">
                            {pnlData?.expenses?.accounts?.map((account: any) => (
                              <div key={account.accountId} className="flex justify-between items-center">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {account.accountName}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {formatCurrency(account.amount)}
                                </span>
                              </div>
                            ))}
                            <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                              <div className="flex justify-between items-center font-bold">
                                <span className="text-gray-900 dark:text-white">Total Expenses</span>
                                <span className="text-red-600">
                                  {formatCurrency(pnlData?.expenses?.total || 0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Net Income */}
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Net Income</h3>
                          <span className={`text-3xl font-bold ${
                            (pnlData?.netIncome || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(pnlData?.netIncome || 0)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Balance Sheet Tab */}
              {activeTab === 'balance' && (
                <div className="space-y-6">
                  {isBalanceLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Activity className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Assets */}
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-600 mb-4">Assets</h3>
                        <div className="space-y-2">
                          {balanceSheetData?.assets?.accounts?.map((account: any) => (
                            <div key={account.accountId} className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {account.accountName}
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatCurrency(account.balance)}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-gray-900 dark:text-white">Total Assets</span>
                              <span className="text-blue-600">
                                {formatCurrency(balanceSheetData?.assets?.total || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Liabilities */}
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-red-600 mb-4">Liabilities</h3>
                        <div className="space-y-2">
                          {balanceSheetData?.liabilities?.accounts?.map((account: any) => (
                            <div key={account.accountId} className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {account.accountName}
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatCurrency(account.balance)}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-gray-900 dark:text-white">Total Liabilities</span>
                              <span className="text-red-600">
                                {formatCurrency(balanceSheetData?.liabilities?.total || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Equity */}
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-green-600 mb-4">Equity</h3>
                        <div className="space-y-2">
                          {balanceSheetData?.equity?.accounts?.map((account: any) => (
                            <div key={account.accountId} className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {account.accountName}
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatCurrency(account.balance)}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-gray-900 dark:text-white">Total Equity</span>
                              <span className="text-green-600">
                                {formatCurrency(balanceSheetData?.equity?.total || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tax Summary Tab */}
              {activeTab === 'tax' && (
                <div className="space-y-4">
                  {isTaxLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Activity className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Tax Summary Report
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Tax Collected</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                            {formatCurrency(taxData?.totalTaxCollected || 0)}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tax Payable</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                            {formatCurrency(taxData?.taxPayable || 0)}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tax Paid</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                            {formatCurrency(taxData?.taxPaid || 0)}
                          </p>
                        </div>
                      </div>

                      <table className="w-full">
                        <thead className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Tax Rate
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Region
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Amount Collected
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {taxData?.byRate?.map((item: any, index: number) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {item.rateName || 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                {item.region || 'All'}
                              </td>
                              <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                                {formatCurrency(item.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
