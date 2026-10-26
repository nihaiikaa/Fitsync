import { apiClient, withFallback } from './api';
import { WorkoutPlan, WorkoutSession, WorkoutExerciseLog } from '../types';
import { INITIAL_WORKOUT_PLANS, INITIAL_TODAY_WORKOUT, MOCK_WORKOUT_HISTORY } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const PLANS_STORAGE_KEY = 'workout_plans';
const TODAY_STORAGE_KEY = 'today_workout';
const HISTORY_STORAGE_KEY = 'workout_history';

export const workoutService = {
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    return withFallback(
      () => apiClient.get('/workout-plans'),
      () => loadFromStorage<WorkoutPlan[]>(PLANS_STORAGE_KEY, INITIAL_WORKOUT_PLANS)
    );
  },

  async getWorkoutPlanById(id: string): Promise<WorkoutPlan | undefined> {
    return withFallback(
      () => apiClient.get(`/workout-plans/${id}`),
      async () => {
        const plans = await this.getWorkoutPlans();
        return plans.find((p) => p.id === id);
      }
    );
  },

  async createWorkoutPlan(plan: Omit<WorkoutPlan, 'id'>): Promise<WorkoutPlan> {
    return withFallback(
      () => apiClient.post('/workout-plans', plan),
      () => {
        const plans = loadFromStorage<WorkoutPlan[]>(PLANS_STORAGE_KEY, INITIAL_WORKOUT_PLANS);
        const newPlan: WorkoutPlan = {
          ...plan,
          id: `wp-${Date.now()}`,
        };
        const updated = [newPlan, ...plans];
        saveToStorage(PLANS_STORAGE_KEY, updated);
        return newPlan;
      }
    );
  },

  async updateWorkoutPlan(id: string, updates: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
    return withFallback(
      () => apiClient.put(`/workout-plans/${id}`, updates),
      () => {
        const plans = loadFromStorage<WorkoutPlan[]>(PLANS_STORAGE_KEY, INITIAL_WORKOUT_PLANS);
        const index = plans.findIndex((p) => p.id === id);
        if (index === -1) throw new Error('Workout plan not found');
        const updated = { ...plans[index], ...updates };
        plans[index] = updated;
        saveToStorage(PLANS_STORAGE_KEY, plans);
        return updated;
      }
    );
  },

  async deleteWorkoutPlan(id: string): Promise<{ success: boolean }> {
    return withFallback(
      () => apiClient.delete(`/workout-plans/${id}`),
      () => {
        const plans = loadFromStorage<WorkoutPlan[]>(PLANS_STORAGE_KEY, INITIAL_WORKOUT_PLANS);
        const updated = plans.filter((p) => p.id !== id);
        saveToStorage(PLANS_STORAGE_KEY, updated);
        return { success: true };
      }
    );
  },

  async getTodayWorkout(): Promise<WorkoutSession> {
    return withFallback(
      () => apiClient.get('/workouts/today'),
      () => loadFromStorage<WorkoutSession>(TODAY_STORAGE_KEY, INITIAL_TODAY_WORKOUT)
    );
  },

  async saveTodayWorkout(session: WorkoutSession): Promise<WorkoutSession> {
    return withFallback(
      () => apiClient.put('/workouts/today', session),
      () => {
        saveToStorage(TODAY_STORAGE_KEY, session);
        return session;
      }
    );
  },

  async completeWorkout(session: WorkoutSession): Promise<{ success: boolean; session: WorkoutSession }> {
    return withFallback(
      () => apiClient.post('/workouts/complete', session),
      () => {
        const completedSession: WorkoutSession = {
          ...session,
          status: 'completed',
        };
        saveToStorage(TODAY_STORAGE_KEY, completedSession);

        // Append to history
        const history = loadFromStorage<any[]>(HISTORY_STORAGE_KEY, MOCK_WORKOUT_HISTORY);
        const newHistoryItem = {
          id: `h-${Date.now()}`,
          title: session.title,
          date: new Date().toISOString().split('T')[0],
          duration: `${session.durationMinutes} mins`,
          calories: session.caloriesBurned,
          completed: true,
          rating: 5,
        };
        saveToStorage(HISTORY_STORAGE_KEY, [newHistoryItem, ...history]);

        return { success: true, session: completedSession };
      }
    );
  },

  async getWorkoutHistory(): Promise<any[]> {
    return withFallback(
      () => apiClient.get('/workouts/history'),
      () => loadFromStorage<any[]>(HISTORY_STORAGE_KEY, MOCK_WORKOUT_HISTORY)
    );
  },
};
