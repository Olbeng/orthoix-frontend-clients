// ===========================================
// ORTHOIX - Portal Store
// ===========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Patient {
  id: number;
  patientNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

interface PortalState {
  token: string | null;
  patient: Patient | null;
  setToken: (token: string) => void;
  setPatient: (patient: Patient) => void;
  logout: () => void;
}

export const usePortalStore = create<PortalState>()(
  persist(
    (set) => ({
      token: null,
      patient: null,
      setToken: (token) => set({ token }),
      setPatient: (patient) => set({ patient }),
      logout: () => set({ token: null, patient: null }),
    }),
    {
      name: 'orthoix-portal-storage',
    }
  )
);
