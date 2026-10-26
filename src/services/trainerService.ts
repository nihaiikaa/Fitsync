import { apiClient, withFallback } from './api';
import { Trainer, Member } from '../types';
import { INITIAL_TRAINERS } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { memberService } from './memberService';

const STORAGE_KEY = 'trainers';

const getStoredTrainers = (): Trainer[] => {
  return loadFromStorage<Trainer[]>(STORAGE_KEY, INITIAL_TRAINERS);
};

export const trainerService = {
  async getTrainers(): Promise<Trainer[]> {
    return withFallback(
      () => apiClient.get('/trainers'),
      () => getStoredTrainers()
    );
  },

  async getTrainerById(id: string): Promise<Trainer | undefined> {
    return withFallback(
      () => apiClient.get(`/trainers/${id}`),
      () => getStoredTrainers().find((t) => t.id === id)
    );
  },

  async addTrainer(trainer: Omit<Trainer, 'id'>): Promise<Trainer> {
    return withFallback(
      () => apiClient.post('/trainers', trainer),
      () => {
        const list = getStoredTrainers();
        const newTrainer: Trainer = {
          ...trainer,
          id: `t-${Date.now()}`,
          avatar: trainer.avatar || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200',
          assignedMemberCount: trainer.assignedMemberCount || 0,
          rating: trainer.rating || 5.0,
        };
        const updated = [newTrainer, ...list];
        saveToStorage(STORAGE_KEY, updated);
        return newTrainer;
      }
    );
  },

  async updateTrainer(id: string, updates: Partial<Trainer>): Promise<Trainer> {
    return withFallback(
      () => apiClient.put(`/trainers/${id}`, updates),
      () => {
        const list = getStoredTrainers();
        const index = list.findIndex((t) => t.id === id);
        if (index === -1) throw new Error('Trainer not found');
        const updatedTrainer = { ...list[index], ...updates };
        list[index] = updatedTrainer;
        saveToStorage(STORAGE_KEY, list);
        return updatedTrainer;
      }
    );
  },

  async deleteTrainer(id: string): Promise<{ success: boolean }> {
    return withFallback(
      () => apiClient.delete(`/trainers/${id}`),
      () => {
        const list = getStoredTrainers();
        const filtered = list.filter((t) => t.id !== id);
        saveToStorage(STORAGE_KEY, filtered);
        return { success: true };
      }
    );
  },

  async getAssignedMembers(trainerId: string): Promise<Member[]> {
    return withFallback(
      () => apiClient.get(`/trainers/${trainerId}/members`),
      async () => {
        const members = await memberService.getMembers();
        // Return members assigned to this trainer or fallback to first few for demo
        const filtered = members.filter((m) => m.trainerId === trainerId);
        return filtered.length > 0 ? filtered : members.slice(0, 4);
      }
    );
  },
};
