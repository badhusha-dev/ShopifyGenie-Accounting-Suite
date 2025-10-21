import { api } from './api'
import { LoginRequest, RegisterRequest, User } from '@shopifygenie/shared'

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export interface UserResponse {
  success: boolean
  data: User
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  getMe: async (): Promise<UserResponse> => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateProfile: async (data: Partial<User>): Promise<UserResponse> => {
    const response = await api.put('/auth/profile', data)
    return response.data
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return response.data
  },
}
