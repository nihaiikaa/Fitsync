import { apiClient, withFallback } from './api';
import { WeightLog } from '../types';
import { INITIAL_WEIGHT_LOGS } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'weight_logs';

export const progressService = {
  async getWeightLogs(memberId: string): Promise<WeightLog[]> {
    return withFallback(
      () => apiClient.get(`/members/${memberId}/weight-logs`),
      () => {
        const logs = loadFromStorage<WeightLog[]>(STORAGE_KEY, INITIAL_WEIGHT_LOGS);
        return logs;
      }
    );
  },

  async addWeightLog(log: Omit<WeightLog, 'id'>): Promise<WeightLog> {
    return withFallback(
      () => apiClient.post(`/members/${log.memberId}/weight-logs`, log),
      () => {
        const logs = loadFromStorage<WeightLog[]>(STORAGE_KEY, INITIAL_WEIGHT_LOGS);
        const newLog: WeightLog = {
          ...log,
          id: `w-${Date.now()}`,
        };
        const updated = [...logs, newLog];
        saveToStorage(STORAGE_KEY, updated);
        return newLog;
      }
    );
  },
};
