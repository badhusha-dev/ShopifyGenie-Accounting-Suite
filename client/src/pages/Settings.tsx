import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, SettingsData, UserData } from '@/services/settingsService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Building2,
  ShoppingBag,
  Calculator,
  Users,
  Save,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  Shield,
  Settings as SettingsIcon,
} from 'lucide-react';

type TabId = 'company' | 'shopify' | 'accounting' | 'users';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Building2;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'company',
    label: 'Company Info',
    icon: Building2,
    description: 'Manage company details and preferences',
  },
  {
    id: 'shopify',
    label: 'Shopify Integration',
    icon: ShoppingBag,
    description: 'Configure Shopify connection and sync settings',
  },
  {
    id: 'accounting',
    label: 'Accounting Defaults',
    icon: Calculator,
    description: 'Set default accounts and preferences',
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    description: 'Manage users and permissions',
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>('company');
  const [formData, setFormData] = useState<Partial<SettingsData>>({});
  const queryClient = useQueryClient();

  // Fetch settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
  });

  // Fetch users (for user management tab)
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: settingsService.getAllUsers,
    enabled: activeTab === 'users',
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<SettingsData>) => settingsService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      toast.success('Settings updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: any }) =>
      settingsService.updateUser(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });

  // Reset settings mutation
  const resetMutation = useMutation({
    mutationFn: settingsService.resetSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      toast.success('Settings reset to defaults!');
    },
    onError: () => {
      toast.error('Failed to reset settings');
    },
  });

  // Load settings into form
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      resetMutation.mutate();
    }
  };

  const handleUserToggle = (userId: string, currentStatus: boolean) => {
    updateUserMutation.mutate({
      userId,
      updates: { isActive: !currentStatus },
    });
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    updateUserMutation.mutate({
      userId,
      updates: { role: newRole },
    });
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-indigo-600" />
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your system configuration and preferences
        </p>
      </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reset to Defaults
        </motion.button>
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
                      layoutId="activeTab"
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
              {/* Company Tab */}
              {activeTab === 'company' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Company Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Your Company Name"
                        />
            </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Company Email
                        </label>
                        <input
                          type="email"
                          name="companyEmail"
                          value={formData.companyEmail || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="company@example.com"
                        />
          </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="companyPhone"
                          value={formData.companyPhone || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="+60 12-345-6789"
                        />
      </div>

            <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tax ID / Registration Number
                        </label>
                        <input
                          type="text"
                          name="companyTaxId"
                          value={formData.companyTaxId || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="123456789012"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Company Address
              </label>
                <input
                  type="text"
                          name="companyAddress"
                          value={formData.companyAddress || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="123 Business Street, City, State, ZIP"
                />
              </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Base Currency
                        </label>
                        <select
                          name="baseCurrency"
                          value={formData.baseCurrency || 'MYR'}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="MYR">MYR - Malaysian Ringgit</option>
                          <option value="USD">USD - US Dollar</option>
                          <option value="SGD">SGD - Singapore Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                        </select>
            </div>

            <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fiscal Year Start
              </label>
                <input
                          type="date"
                          name="fiscalYearStart"
                          value={formData.fiscalYearStart ? new Date(formData.fiscalYearStart).toISOString().split('T')[0] : ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}

              {/* Shopify Tab */}
              {activeTab === 'shopify' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Shopify Integration Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Shop Domain
                        </label>
                        <input
                          type="text"
                          name="shopDomain"
                          value={formData.shopDomain || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="your-store.myshopify.com"
                        />
                      </div>

            <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Sync Frequency
              </label>
                        <select
                          name="syncFrequency"
                          value={formData.syncFrequency || 'daily'}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="hourly">Every Hour</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="manual">Manual Only</option>
                </select>
              </div>

                      <div className="flex items-center">
                        <div className="flex items-center h-full">
                          <input
                            type="checkbox"
                            name="autoSync"
                            checked={formData.autoSync || false}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Enable Auto-Sync
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center md:col-span-2">
                        <input
                          type="checkbox"
                          name="webhooksEnabled"
                          checked={formData.webhooksEnabled !== false}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Enable Webhooks for Real-time Updates
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                          Shopify API Credentials
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          API credentials are configured through environment variables for security.
                          Contact your system administrator to update API keys.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}

              {/* Accounting Tab */}
              {activeTab === 'accounting' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Accounting Preferences
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Date Format
                        </label>
                        <select
                          name="dateFormat"
                          value={formData.dateFormat || 'YYYY-MM-DD'}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="YYYY-MM-DD">YYYY-MM-DD (2025-01-31)</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY (31/01/2025)</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY (01/31/2025)</option>
                        </select>
            </div>

            <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Time Zone
                        </label>
                        <select
                          name="timeZone"
                          value={formData.timeZone || 'Asia/Kuala_Lumpur'}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="Asia/Kuala_Lumpur">Asia/Kuala Lumpur (GMT+8)</option>
                          <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                          <option value="UTC">UTC (GMT+0)</option>
                          <option value="America/New_York">America/New York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="enableAuditLog"
                          checked={formData.enableAuditLog !== false}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Enable Audit Logging
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="requireApproval"
                          checked={formData.requireApproval || false}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Require Approval for Journal Entries
              </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-amber-900 dark:text-amber-200">
                          Default Account Configuration
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          Default accounts for automatic journal entries can be configured in the Chart of Accounts page.
                        </p>
              </div>
            </div>
          </div>

                  <div className="flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      User Management
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {users?.length || 0} users
                    </div>
                  </div>

                  {usersLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {users?.map((user: UserData) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                      {user.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {user.name}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                  className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                >
                                  <option value="SUPER_ADMIN">Super Admin</option>
                                  <option value="ACCOUNTING">Accounting</option>
                                  <option value="SHOPIFY_MANAGER">Shopify Manager</option>
                                  <option value="AUDITOR">Auditor</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleUserToggle(user.id, user.isActive)}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    user.isActive
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  }`}
                                >
                                  {user.isActive ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      Active
                                    </>
                                  ) : (
                                    <>
                                      <X className="w-3 h-3" />
                                      Inactive
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
            <button
                                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                  title="Manage permissions"
            >
                                  <Shield className="w-5 h-5" />
            </button>
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
