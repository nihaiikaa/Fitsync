import { apiClient, withFallback } from './api';
import { PaymentRecord } from '../types';
import { INITIAL_PAYMENTS } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'payments';

export const paymentService = {
  async getPayments(): Promise<PaymentRecord[]> {
    return withFallback(
      () => apiClient.get('/payments'),
      () => loadFromStorage<PaymentRecord[]>(STORAGE_KEY, INITIAL_PAYMENTS)
    );
  },

  async recordPayment(payment: Omit<PaymentRecord, 'id' | 'invoiceNumber'>): Promise<PaymentRecord> {
    return withFallback(
      () => apiClient.post('/payments', payment),
      () => {
        const payments = loadFromStorage<PaymentRecord[]>(STORAGE_KEY, INITIAL_PAYMENTS);
        const newPayment: PaymentRecord = {
          ...payment,
          id: `pay-${Date.now()}`,
          invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        };
        const updated = [newPayment, ...payments];
        saveToStorage(STORAGE_KEY, updated);
        return newPayment;
      }
    );
  },
};
