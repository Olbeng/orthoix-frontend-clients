// ===========================================
// ORTHOIX - Portal del Paciente App
// ===========================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, CreditCard, FileText, User, LogOut, Home, Stethoscope } from 'lucide-react';
import { usePortalStore } from './store/portalStore';
import { api } from './services/api';

// Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AppointmentsPage from './pages/AppointmentsPage';
import TreatmentsPage from './pages/TreatmentsPage';
import PaymentsPage from './pages/PaymentsPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = usePortalStore();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function PortalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { logout, patient } = usePortalStore();

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/appointments', icon: Calendar, label: 'Mis Citas' },
    { path: '/treatments', icon: Stethoscope, label: 'Tratamientos' },
    { path: '/payments', icon: CreditCard, label: 'Pagos' },
    { path: '/profile', icon: User, label: 'Mi Perfil' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">OrthoIX</h1>
                <p className="text-xs text-gray-500">Portal del Paciente</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Hola, {patient?.firstName}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex w-64 bg-white border-r min-h-[calc(100vh-64px)] flex-col">
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-5xl mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-2 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <item.icon size={20} />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  const { token, setPatient } = usePortalStore();

  // Load patient profile
  useQuery({
    queryKey: ['patient-profile'],
    queryFn: async () => {
      const res = await api.get('/portal/profile');
      setPatient(res.data);
      return res.data;
    },
    enabled: !!token,
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <PortalLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/appointments" element={<AppointmentsPage />} />
                  <Route path="/treatments" element={<TreatmentsPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </PortalLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
