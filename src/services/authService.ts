import { apiClient, withFallback } from './api';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    return withFallback(
      () => apiClient.post('/auth/login', credentials),
      () => {
        // Find matching demo user by email or matching role
        const emailLower = credentials.email.toLowerCase().trim();
        let matchedUser = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === emailLower);

        if (!matchedUser) {
          // If no exact match, create or default to requested role or member
          const role: UserRole = credentials.role || 'member';
          matchedUser = {
            id: `u-${Date.now()}`,
            name: credentials.email.split('@')[0] || 'Demo User',
            email: credentials.email,
            role: role,
            joinedDate: new Date().toISOString().split('T')[0],
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          };
        }

        const token = `mock-jwt-token-${matchedUser.role}-${Date.now()}`;
        saveToStorage('current_user', matchedUser);
        saveToStorage('token', token);
        return { user: matchedUser, token };
      }
    );
  },

  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    return withFallback(
      () => apiClient.post('/auth/register', payload),
      () => {
        const newUser: User = {
          id: `u-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          role: payload.role,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          joinedDate: new Date().toISOString().split('T')[0],
        };
        const token = `mock-jwt-token-${newUser.role}-${Date.now()}`;
        saveToStorage('current_user', newUser);
        saveToStorage('token', token);
        return { user: newUser, token };
      }
    );
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return withFallback(
      () => apiClient.post('/auth/forgot-password', { email }),
      () => ({
        success: true,
        message: `Password reset instructions have been dispatched to ${email}.`,
      })
    );
  },

  getCurrentUser(): User | null {
    return loadFromStorage<User | null>('current_user', DEMO_USERS.admin);
  },

  logout(): void {
    localStorage.removeItem('fitsync_current_user');
    localStorage.removeItem('fitsync_token');
  },
};
