// ===========================================
// ORTHOIX - Portal Payments Page
// ===========================================

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreditCard, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function PaymentsPage() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['portal-payments'],
    queryFn: async () => {
      const res = await api.get('/portal/payments');
      return res.data;
    },
  });

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Pagos</h1>
        <p className="text-gray-600">Estado de cuenta y planes de pago</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Cargando...
        </div>
      ) : (
        <>
          {/* Balance Summary */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Saldo pendiente total</p>
                <p className="text-3xl font-bold mt-1">
                  ${(payments?.totalBalance || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <CreditCard size={32} />
              </div>
            </div>
          </div>

          {/* Payment Plans */}
          {payments?.plans?.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Planes de Pago Activos</h2>
              {payments.plans.map((plan: any) => (
                <div key={plan.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{plan.planName || plan.treatment || 'Plan de Pago'}</h3>
                        <p className="text-sm text-gray-500">
                          Balance: ${Number(plan.balance).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {plan.status === 'active' ? 'Activo' : 'Vencido'}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Pagado</span>
                        <span className="font-medium">
                          ${Number(plan.totalPaid).toLocaleString()} / ${Number(plan.totalAmount).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(Number(plan.totalPaid) / Number(plan.totalAmount)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Installments */}
                  {plan.nextInstallments?.length > 0 && (
                    <div className="p-4 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Próximos pagos</h4>
                      <div className="space-y-2">
                        {plan.nextInstallments.map((installment: any) => {
                          const isOverdue = new Date(installment.dueDate) < new Date();
                          return (
                            <div
                              key={installment.id}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                isOverdue ? 'bg-red-50 border border-red-200' : 'bg-white border'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {isOverdue ? (
                                  <AlertCircle className="text-red-500" size={18} />
                                ) : (
                                  <Calendar className="text-gray-400" size={18} />
                                )}
                                <div>
                                  <p className="font-medium">
                                    Cuota #{installment.installmentNumber}
                                  </p>
                                  <p className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                                    {isOverdue ? 'Vencido: ' : 'Vence: '}
                                    {format(new Date(installment.dueDate), "d 'de' MMMM", { locale: es })}
                                  </p>
                                </div>
                              </div>
                              <span className="font-semibold">
                                ${Number(installment.amount).toLocaleString()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Recent Payments */}
          {payments?.recentPayments?.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Historial de Pagos</h2>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="divide-y">
                  {payments.recentPayments.map((payment: any) => (
                    <div key={payment.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium">{payment.paymentNumber}</p>
                          <p className="text-sm text-gray-500">{payment.method}</p>
                          <p className="text-sm text-gray-500">{payment.notes && ` • ${payment.notes}`}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          +${Number(payment.amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(payment.date), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No Data */}
          {!payments?.plans?.length && !payments?.recentPayments?.length && (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              <CreditCard className="mx-auto mb-3 text-gray-300" size={48} />
              <p>No tienes información de pagos</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
