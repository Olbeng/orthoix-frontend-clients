// ===========================================
// ORTHOIX - Portal Treatments Page
// ===========================================

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Stethoscope, ChevronDown, ChevronUp, CheckCircle, Clock, Circle } from 'lucide-react';
import { api } from '../services/api';

const statusColors: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  planned: 'Planificado',
  active: 'En progreso',
  paused: 'Pausado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const stageStatusIcons: Record<string, React.ReactNode> = {
  completed: <CheckCircle className="text-green-500" size={18} />,
  in_progress: <Clock className="text-yellow-500" size={18} />,
  pending: <Circle className="text-gray-300" size={18} />,
  skipped: <Circle className="text-gray-400" size={18} />,
};

export default function TreatmentsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: treatments, isLoading } = useQuery({
    queryKey: ['portal-treatments'],
    queryFn: async () => {
      const res = await api.get('/portal/treatments');
      return res.data;
    },
  });

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Tratamientos</h1>
        <p className="text-gray-600">Seguimiento de tus tratamientos dentales</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Cargando...
        </div>
      ) : treatments?.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          <Stethoscope className="mx-auto mb-3 text-gray-300" size={48} />
          <p>No tienes tratamientos registrados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {treatments?.map((treatment: any) => (
            <div key={treatment.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === treatment.id ? null : treatment.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Stethoscope className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{treatment.type}</h3>
                      <p className="text-sm text-gray-500">Dr. {treatment.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[treatment.status]}`}>
                      {statusLabels[treatment.status]}
                    </span>
                    {expandedId === treatment.id ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Progreso del tratamiento</span>
                    <span className="font-medium">{treatment.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${treatment.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === treatment.id && (
                <div className="border-t px-4 py-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Fecha de inicio</span>
                      <p className="font-medium">
                        {treatment.startDate
                          ? format(new Date(treatment.startDate), "d 'de' MMMM, yyyy", { locale: es })
                          : 'Por definir'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Fecha estimada de fin</span>
                      <p className="font-medium">
                        {treatment.estimatedEndDate
                          ? format(new Date(treatment.estimatedEndDate), "d 'de' MMMM, yyyy", { locale: es })
                          : 'Por definir'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Stages */}
                  {treatment.stages?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Etapas del tratamiento</h4>
                      <div className="space-y-3">
                        {treatment.stages.map((stage: any, index: number) => (
                          <div
                            key={stage.id}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border"
                          >
                            {stageStatusIcons[stage.status]}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {index + 1}. {stage.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
