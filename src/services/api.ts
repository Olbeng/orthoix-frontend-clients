// ===========================================
// ORTHOIX - Portal API Service
// ===========================================

import axios from 'axios';
import { usePortalStore } from '../store/portalStore';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = usePortalStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      usePortalStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const portalAuth = {
  login: async (patientNumber: string, password: string) => {
    const res = await api.post('/auth/portal/login', { patientNumber, password });
    return res.data;
  },
};

// Profile
export const portalProfile = {
  get: async () => {
    const res = await api.get('/portal/profile');
    return res.data;
  },
};

// Appointments
export const portalAppointments = {
  list: async (upcoming?: boolean) => {
    const res = await api.get('/portal/appointments', { params: { upcoming } });
    return res.data;
  },
};

// Treatments
export const portalTreatments = {
  list: async () => {
    const res = await api.get('/portal/treatments');
    return res.data;
  },
};

// Payments
export const portalPayments = {
  getSummary: async () => {
    const res = await api.get('/portal/payments');
    return res.data;
  },
};
