import { apiClient, withFallback } from './api';
import { Member } from '../types';
import { INITIAL_MEMBERS } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'members';

const getStoredMembers = (): Member[] => {
  return loadFromStorage<Member[]>(STORAGE_KEY, INITIAL_MEMBERS);
};

export const memberService = {
  async getMembers(): Promise<Member[]> {
    return withFallback(
      () => apiClient.get('/members'),
      () => getStoredMembers()
    );
  },

  async getMemberById(id: string): Promise<Member | undefined> {
    return withFallback(
      () => apiClient.get(`/members/${id}`),
      () => getStoredMembers().find((m) => m.id === id)
    );
  },

  async addMember(member: Omit<Member, 'id'>): Promise<Member> {
    return withFallback(
      () => apiClient.post('/members', member),
      () => {
        const list = getStoredMembers();
        const newMember: Member = {
          ...member,
          id: `m-${Date.now()}`,
          avatar: member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        };
        const updated = [newMember, ...list];
        saveToStorage(STORAGE_KEY, updated);
        return newMember;
      }
    );
  },

  async updateMember(id: string, updates: Partial<Member>): Promise<Member> {
    return withFallback(
      () => apiClient.put(`/members/${id}`, updates),
      () => {
        const list = getStoredMembers();
        const index = list.findIndex((m) => m.id === id);
        if (index === -1) throw new Error('Member not found');
        const updatedMember = { ...list[index], ...updates };
        list[index] = updatedMember;
        saveToStorage(STORAGE_KEY, list);
        return updatedMember;
      }
    );
  },

  async deleteMember(id: string): Promise<{ success: boolean }> {
    return withFallback(
      () => apiClient.delete(`/members/${id}`),
      () => {
        const list = getStoredMembers();
        const filtered = list.filter((m) => m.id !== id);
        saveToStorage(STORAGE_KEY, filtered);
        return { success: true };
      }
    );
  },

  async assignTrainer(memberId: string, trainerId: string, trainerName: string): Promise<Member> {
    return this.updateMember(memberId, { trainerId, trainerName });
  },
};
