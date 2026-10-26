import { apiClient, withFallback } from './api';
import { AttendanceRecord } from '../types';
import { INITIAL_ATTENDANCE } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'attendance';

export const attendanceService = {
  async getAttendance(): Promise<AttendanceRecord[]> {
    return withFallback(
      () => apiClient.get('/attendance'),
      () => loadFromStorage<AttendanceRecord[]>(STORAGE_KEY, INITIAL_ATTENDANCE)
    );
  },

  async checkIn(memberId: string, memberName: string): Promise<AttendanceRecord> {
    return withFallback(
      () => apiClient.post('/attendance/check-in', { memberId, memberName }),
      () => {
        const records = loadFromStorage<AttendanceRecord[]>(STORAGE_KEY, INITIAL_ATTENDANCE);
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toISOString().split('T')[0];

        const newRecord: AttendanceRecord = {
          id: `att-${Date.now()}`,
          memberId,
          memberName,
          checkInTime: timeStr,
          date: dateStr,
          status: 'checked_in',
        };
        const updated = [newRecord, ...records];
        saveToStorage(STORAGE_KEY, updated);
        return newRecord;
      }
    );
  },

  async checkOut(attendanceId: string): Promise<AttendanceRecord> {
    return withFallback(
      () => apiClient.post(`/attendance/${attendanceId}/check-out`),
      () => {
        const records = loadFromStorage<AttendanceRecord[]>(STORAGE_KEY, INITIAL_ATTENDANCE);
        const index = records.findIndex((r) => r.id === attendanceId);
        if (index === -1) throw new Error('Record not found');
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const updatedRecord: AttendanceRecord = {
          ...records[index],
          checkOutTime: timeStr,
          status: 'completed',
        };
        records[index] = updatedRecord;
        saveToStorage(STORAGE_KEY, records);
        return updatedRecord;
      }
    );
  },
};
