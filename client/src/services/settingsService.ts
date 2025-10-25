import axios from 'axios';

const api = axios.create({
  baseURL: '/api/settings',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface SettingsData {
  id?: string;
  // Company Information
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyTaxId?: string;
  baseCurrency?: string;
  fiscalYearStart?: string | Date;

  // Accounting Defaults
  defaultSalesAccountId?: string;
  defaultCOGSAccountId?: string;
  defaultTaxAccountId?: string;
  defaultFeeAccountId?: string;
  defaultARAccountId?: string;
  defaultAPAccountId?: string;
  defaultCashAccountId?: string;

  // Shopify Integration
  shopDomain?: string;
  shopifyApiKey?: string;
  shopifyApiSecret?: string;
  syncFrequency?: string;
  autoSync?: boolean;
  webhooksEnabled?: boolean;

  // System Preferences
  dateFormat?: string;
  timeZone?: string;
  enableAuditLog?: boolean;
  requireApproval?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const settingsService = {
  // Get system settings
  getSettings: async (): Promise<SettingsData> => {
    const { data } = await api.get('/');
    return data.data;
  },

  // Update settings
  updateSettings: async (settings: Partial<SettingsData>): Promise<SettingsData> => {
    const { data } = await api.put('/', settings);
    return data.data;
  },

  // Reset settings to defaults (Admin only)
  resetSettings: async (): Promise<SettingsData> => {
    const { data } = await api.post('/reset');
    return data.data;
  },

  // Get all users (Admin only)
  getAllUsers: async (): Promise<UserData[]> => {
    const { data } = await api.get('/users');
    return data.data;
  },

  // Update user
  updateUser: async (userId: string, updates: { role?: string; isActive?: boolean }): Promise<UserData> => {
    const { data } = await api.put(`/users/${userId}`, updates);
    return data.data;
  },
};

