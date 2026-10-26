import { apiClient, withFallback } from './api';
import { MembershipPlan } from '../types';
import { INITIAL_PLANS } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'membership_plans';

export const planService = {
  async getPlans(): Promise<MembershipPlan[]> {
    return withFallback(
      () => apiClient.get('/plans'),
      () => loadFromStorage<MembershipPlan[]>(STORAGE_KEY, INITIAL_PLANS)
    );
  },

  async createPlan(plan: Omit<MembershipPlan, 'id'>): Promise<MembershipPlan> {
    return withFallback(
      () => apiClient.post('/plans', plan),
      () => {
        const plans = loadFromStorage<MembershipPlan[]>(STORAGE_KEY, INITIAL_PLANS);
        const newPlan: MembershipPlan = {
          ...plan,
          id: `plan-${Date.now()}`,
          activeMembersCount: plan.activeMembersCount || 0,
        };
        const updated = [...plans, newPlan];
        saveToStorage(STORAGE_KEY, updated);
        return newPlan;
      }
    );
  },

  async updatePlan(id: string, updates: Partial<MembershipPlan>): Promise<MembershipPlan> {
    return withFallback(
      () => apiClient.put(`/plans/${id}`, updates),
      () => {
        const plans = loadFromStorage<MembershipPlan[]>(STORAGE_KEY, INITIAL_PLANS);
        const index = plans.findIndex((p) => p.id === id);
        if (index === -1) throw new Error('Plan not found');
        const updated = { ...plans[index], ...updates };
        plans[index] = updated;
        saveToStorage(STORAGE_KEY, plans);
        return updated;
      }
    );
  },

  async deletePlan(id: string): Promise<{ success: boolean }> {
    return withFallback(
      () => apiClient.delete(`/plans/${id}`),
      () => {
        const plans = loadFromStorage<MembershipPlan[]>(STORAGE_KEY, INITIAL_PLANS);
        const updated = plans.filter((p) => p.id !== id);
        saveToStorage(STORAGE_KEY, updated);
        return { success: true };
      }
    );
  },
};
