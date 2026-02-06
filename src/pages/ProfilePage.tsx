// ===========================================
// ORTHOIX - Portal Profile Page
// ===========================================

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Phone, Mail, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['portal-profile'],
    queryFn: async () => {
      const res = await api.get('/portal/profile');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-gray-500">
        Cargando...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600">Información de tu cuenta</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-blue-100">{profile?.patientNumber}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                Información de Contacto
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={18} />
                  <span>{profile?.phone || 'No registrado'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" size={18} />
                  <span>{profile?.email || 'No registrado'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p>{profile?.address || 'No registrada'}</p>
                    {profile?.city && (
                      <p className="text-gray-500">
                        {profile.city}{profile.postalCode ? `, CP ${profile.postalCode}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                Información Personal
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={18} />
                  <span>
                    {profile?.birthDate
                      ? format(new Date(profile.birthDate), "d 'de' MMMM, yyyy", { locale: es })
                      : 'No registrada'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="text-gray-400" size={18} />
                  <span>
                    {profile?.gender === 'M' ? 'Masculino' :
                     profile?.gender === 'F' ? 'Femenino' :
                     profile?.gender === 'O' ? 'Otro' : 'No especificado'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="text-red-500" size={20} />
          Contacto de Emergencia
        </h3>
        {profile?.emergencyContactName ? (
          <div className="space-y-2">
            <p className="font-medium">{profile.emergencyContactName}</p>
            <p className="text-gray-500 flex items-center gap-2">
              <Phone size={16} />
              {profile.emergencyContactPhone || 'Sin teléfono'}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No hay contacto de emergencia registrado</p>
        )}
      </div>

      {/* Update Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Para actualizar tu información, por favor contacta a la clínica
          directamente. Puedes hacerlo en tu próxima cita o llamando al consultorio.
        </p>
      </div>
    </div>
  );
}
