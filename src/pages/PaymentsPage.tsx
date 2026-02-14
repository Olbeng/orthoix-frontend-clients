// ===========================================
// ORTHOIX - Portal Payments Page (ACTUALIZADO)
// Incluye ventas pendientes además de planes de pago
// ===========================================

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreditCard, Calendar, AlertCircle, CheckCircle, ShoppingCart, FileText } from 'lucide-react';
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
            
            {/* ✅ NUEVO: Desglose del balance */}
            {(payments?.totalPlanBalance > 0 || payments?.totalSalesBalance > 0) && (
              <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                {payments?.totalPlanBalance > 0 && (
                  <div>
                    <p className="text-blue-200 text-sm">Planes de pago</p>
                    <p className="font-semibold">
                      ${payments.totalPlanBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                {payments?.totalSalesBalance > 0 && (
                  <div>
                    <p className="text-blue-200 text-sm">Ventas pendientes</p>
                    <p className="font-semibold">
                      ${payments.totalSalesBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sin saldo pendiente */}
          {(payments?.totalBalance || 0) === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <CheckCircle className="mx-auto mb-2 text-green-500" size={48} />
              <h3 className="text-lg font-semibold text-green-800">¡Estás al día!</h3>
              <p className="text-green-600">No tienes saldo pendiente por pagar.</p>
            </div>
          )}

          {/* ✅ NUEVO: Ventas Pendientes de Pago */}
          {payments?.pendingSales?.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="text-orange-500" size={20} />
                Ventas Pendientes de Pago
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                  {payments.pendingSales.length}
                </span>
              </h2>
              
              {payments.pendingSales.map((sale: any) => (
                <div key={sale.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="p-4 border-b bg-orange-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="text-orange-600" size={18} />
                          <h3 className="font-medium text-gray-900">{sale.saleNumber}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(sale.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sale.totalPaid > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sale.totalPaid > 0 ? 'Pago Parcial' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Items de la venta */}
                    <div className="text-sm text-gray-600 mb-3">
                      {sale.items?.slice(0, 3).map((item: any, idx: number) => (
                        <span key={idx}>
                          {item.quantity}x {item.description}
                          {idx < Math.min(sale.items.length, 3) - 1 ? ', ' : ''}
                        </span>
                      ))}
                      {sale.items?.length > 3 && (
                        <span className="text-gray-400"> +{sale.items.length - 3} más</span>
                      )}
                    </div>
                    
                    {/* Montos */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="space-y-1 text-sm">
                        <div className="flex gap-4">
                          <span className="text-gray-500">Total:</span>
                          <span className="font-medium">${sale.total.toLocaleString('es-MX')}</span>
                        </div>
                        {sale.totalPaid > 0 && (
                          <div className="flex gap-4">
                            <span className="text-gray-500">Pagado:</span>
                            <span className="font-medium text-green-600">
                              ${sale.totalPaid.toLocaleString('es-MX')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Pendiente</p>
                        <p className="text-xl font-bold text-orange-600">
                          ${sale.balance.toLocaleString('es-MX')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payment Plans */}
          {payments?.plans?.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="text-blue-500" size={20} />
                Planes de Pago Activos
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                  {payments.plans.length}
                </span>
              </h2>
              
              {payments.plans.map((plan: any) => (
                <div key={plan.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">
                          {plan.planName || plan.treatment || 'Plan de Pago'}
                        </h3>
                        {plan.sale && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Venta: {plan.sale}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Balance: ${Number(plan.balance).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        plan.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {plan.status === 'active' ? 'Activo' : 'En mora'}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="px-4 py-3 bg-gray-50">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Progreso</span>
                      <span className="font-medium">
                        ${Number(plan.totalPaid).toLocaleString('es-MX')} / ${Number(plan.totalAmount).toLocaleString('es-MX')}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(100, (Number(plan.totalPaid) / Number(plan.totalAmount)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Next Installments */}
                  {plan.nextInstallments?.length > 0 && (
                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Próximas cuotas:</p>
                      <div className="space-y-2">
                        {plan.nextInstallments.slice(0, 3).map((inst: any) => {
                          const dueDate = new Date(inst.dueDate);
                          const isOverdue = dueDate < new Date();
                          const pending = Number(inst.amount) - Number(inst.paidAmount || 0);
                          
                          return (
                            <div 
                              key={inst.id} 
                              className={`flex items-center justify-between p-2 rounded-lg ${
                                isOverdue ? 'bg-red-50' : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isOverdue ? (
                                  <AlertCircle className="text-red-500" size={16} />
                                ) : (
                                  <Calendar className="text-gray-400" size={16} />
                                )}
                                <div>
                                  <p className={`text-sm font-medium ${isOverdue ? 'text-red-700' : ''}`}>
                                    {inst.isDownPayment ? 'Enganche' : `Cuota #${inst.installmentNumber}`}
                                  </p>
                                  <p className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                                    {isOverdue ? 'Vencida: ' : 'Vence: '}
                                    {format(dueDate, "d MMM yyyy", { locale: es })}
                                  </p>
                                </div>
                              </div>
                              <p className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                ${pending.toLocaleString('es-MX')}
                              </p>
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
              <h2 className="font-semibold text-gray-900">Últimos Pagos</h2>
              <div className="bg-white rounded-xl shadow-sm border divide-y">
                {payments.recentPayments.map((payment: any) => (
                  <div key={payment.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{payment.paymentNumber}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(payment.date), "d MMM yyyy", { locale: es })} • {payment.method}
                          {payment.saleNumber && ` • ${payment.saleNumber}`}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-600">
                      +${Number(payment.amount).toLocaleString('es-MX')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No hay historial */}
          {!payments?.plans?.length && !payments?.pendingSales?.length && !payments?.recentPayments?.length && (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <CreditCard className="mx-auto mb-4 text-gray-300" size={48} />
              <h3 className="text-lg font-medium text-gray-900">Sin actividad de pagos</h3>
              <p className="text-gray-500 mt-1">
                Aún no tienes pagos o planes registrados.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}