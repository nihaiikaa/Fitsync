import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000, // Quick timeout so mock fallback is instant when Spring Boot isn't running
});

// Request interceptor to attach JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitsync_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized if necessary
      console.warn('API returned 401 Unauthorized');
    }
    return Promise.reject(error);
  }
);

/**
 * Executes a network call to the Java Spring Boot backend if available;
 * seamlessly falls back to the local mock repository if backend is offline.
 */
export async function withFallback<T>(
  apiCall: () => Promise<{ data: T }>,
  mockFallback: () => T | Promise<T>
): Promise<T> {
  try {
    const res = await apiCall();
    return res.data;
  } catch (error) {
    // If backend is offline or network fails, run the mock fallback
    // console.info('Backend unreachable, using local mock data engine.');
    return await Promise.resolve(mockFallback());
  }
}
