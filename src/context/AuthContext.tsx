import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { authService, LoginCredentials } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  quickLoginAs: (role: UserRole) => void;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return loadFromStorage<User | null>('current_user', DEMO_USERS.admin);
  });

  const isAuthenticated = !!user;
  const role: UserRole = user?.role || 'admin';

  const login = async (credentials: LoginCredentials) => {
    const res = await authService.login(credentials);
    setUser(res.user);
    saveToStorage('current_user', res.user);
  };

  const quickLoginAs = (targetRole: UserRole) => {
    const demoUser = DEMO_USERS[targetRole];
    setUser(demoUser);
    saveToStorage('current_user', demoUser);
    saveToStorage('token', `mock-jwt-token-${targetRole}`);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    saveToStorage('current_user', updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        quickLoginAs,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
