// ===========================================
// ORTHOIX - Portal Appointments Page
// ===========================================

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { api } from '../services/api';

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-orange-100 text-orange-800',
};

const statusLabels: Record<string, string> = {
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  in_progress: 'En progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
};

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['portal-appointments', filter],
    queryFn: async () => {
      const res = await api.get('/portal/appointments', {
        params: { upcoming: filter === 'upcoming' ? 'true' : undefined },
      });
      return res.data;
    },
  });

  const filteredAppointments = appointments?.filter((apt: any) => {
    if (filter === 'all') return true;
    const isPast = new Date(apt.scheduledStart) < new Date();
    return filter === 'past' ? isPast : !isPast;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
        <p className="text-gray-600">Consulta y gestiona tus citas</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { value: 'upcoming', label: 'Próximas' },
          { value: 'past', label: 'Pasadas' },
          { value: 'all', label: 'Todas' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Cargando...
        </div>
      ) : filteredAppointments?.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          <Calendar className="mx-auto mb-3 text-gray-300" size={48} />
          <p>No tienes citas {filter === 'upcoming' ? 'próximas' : 'pasadas'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments?.map((appointment: any) => (
            <div key={appointment.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="flex">
                {/* Date Column */}
                <div className="w-20 bg-blue-50 flex flex-col items-center justify-center p-4 border-r">
                  <span className="text-2xl font-bold text-blue-600">
                    {format(new Date(appointment.scheduledStart), 'd')}
                  </span>
                  <span className="text-sm text-blue-500 uppercase">
                    {format(new Date(appointment.scheduledStart), 'MMM', { locale: es })}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.type}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {format(new Date(appointment.scheduledStart), 'HH:mm')} hrs
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {appointment.doctor}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                      {statusLabels[appointment.status]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
