import { apiClient, withFallback } from './api';
import { TrainingScheduleItem } from '../types';
import { INITIAL_SCHEDULE } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'training_schedule';

export const scheduleService = {
  async getSchedule(): Promise<TrainingScheduleItem[]> {
    return withFallback(
      () => apiClient.get('/schedules'),
      () => loadFromStorage<TrainingScheduleItem[]>(STORAGE_KEY, INITIAL_SCHEDULE)
    );
  },

  async addScheduleItem(item: Omit<TrainingScheduleItem, 'id'>): Promise<TrainingScheduleItem> {
    return withFallback(
      () => apiClient.post('/schedules', item),
      () => {
        const schedule = loadFromStorage<TrainingScheduleItem[]>(STORAGE_KEY, INITIAL_SCHEDULE);
        const newItem: TrainingScheduleItem = {
          ...item,
          id: `sch-${Date.now()}`,
        };
        const updated = [...schedule, newItem];
        saveToStorage(STORAGE_KEY, updated);
        return newItem;
      }
    );
  },

  async updateScheduleStatus(id: string, status: 'scheduled' | 'completed' | 'cancelled'): Promise<TrainingScheduleItem> {
    return withFallback(
      () => apiClient.patch(`/schedules/${id}/status`, { status }),
      () => {
        const schedule = loadFromStorage<TrainingScheduleItem[]>(STORAGE_KEY, INITIAL_SCHEDULE);
        const index = schedule.findIndex((s) => s.id === id);
        if (index === -1) throw new Error('Schedule item not found');
        const updated = { ...schedule[index], status };
        schedule[index] = updated;
        saveToStorage(STORAGE_KEY, schedule);
        return updated;
      }
    );
  },

  async deleteScheduleItem(id: string): Promise<{ success: boolean }> {
    return withFallback(
      () => apiClient.delete(`/schedules/${id}`),
      () => {
        const schedule = loadFromStorage<TrainingScheduleItem[]>(STORAGE_KEY, INITIAL_SCHEDULE);
        const updated = schedule.filter((s) => s.id !== id);
        saveToStorage(STORAGE_KEY, updated);
        return { success: true };
      }
    );
  },
};
