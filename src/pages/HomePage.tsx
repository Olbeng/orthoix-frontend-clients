// ===========================================
// ORTHOIX - Portal Home Page
// ===========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CreditCard, Stethoscope, Clock, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { usePortalStore } from '../store/portalStore';

export default function HomePage() {
  const { patient } = usePortalStore();

  const { data: appointments } = useQuery({
    queryKey: ['portal-appointments-upcoming'],
    queryFn: async () => {
      const res = await api.get('/portal/appointments', { params: { upcoming: 'true' } });
      return res.data;
    },
  });

  const { data: treatments } = useQuery({
    queryKey: ['portal-treatments'],
    queryFn: async () => {
      const res = await api.get('/portal/treatments');
      return res.data;
    },
  });

  const { data: payments } = useQuery({
    queryKey: ['portal-payments'],
    queryFn: async () => {
      const res = await api.get('/portal/payments');
      return res.data;
    },
  });

  const nextAppointment = appointments?.[0];
  const activeTreatment = treatments?.find((t: any) => t.status === 'active');

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          ¡Hola, {patient?.firstName}! 👋
        </h1>
        <p className="text-blue-100 mt-1">
          Bienvenido a tu portal de paciente
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">{appointments?.length || 0}</div>
              <div className="text-sm text-gray-500">Citas próximas</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Stethoscope className="text-green-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {treatments?.filter((t: any) => t.status === 'active').length || 0}
              </div>
              <div className="text-sm text-gray-500">Tratamientos activos</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCard className="text-orange-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">
                ${(payments?.totalBalance || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Saldo pendiente</div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Appointment */}
      {nextAppointment && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Próxima Cita</h2>
            <Link to="/appointments" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {format(new Date(nextAppointment.scheduledStart), 'd')}
                </span>
                <span className="text-xs text-blue-500 uppercase">
                  {format(new Date(nextAppointment.scheduledStart), 'MMM', { locale: es })}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{nextAppointment.type}</h3>
                <p className="text-sm text-gray-500">
                  {nextAppointment.doctor}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Clock size={14} />
                  {format(new Date(nextAppointment.scheduledStart), 'HH:mm')} hrs
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Treatment */}
      {activeTreatment && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Tratamiento Activo</h2>
            <Link to="/treatments" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              Ver detalles <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium">{activeTreatment.type}</h3>
                <p className="text-sm text-gray-500">
                  Dr. {activeTreatment.doctor}
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                En progreso
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500">Progreso</span>
                <span className="font-medium">{activeTreatment.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${activeTreatment.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Payments */}
      {payments?.recentPayments?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">Pagos Recientes</h2>
            <Link to="/payments" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              Ver historial <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y">
            {payments.recentPayments.slice(0, 3).map((payment: any) => (
              <div key={payment.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">${Number(payment.amount).toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{payment.method}</div>
                  <div className="text-sm text-gray-500">{payment.notes && ` • ${payment.notes}`}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(payment.date), 'dd/MM/yyyy')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
