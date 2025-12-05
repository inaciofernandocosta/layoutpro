import React, { useState } from 'react';
import { X, Calendar, User, Building2, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { PurchaseOrder, Quotation } from '../types';
import { StatusBadge } from './StatusBadge';
import { mockSuppliers } from '../data/mockData';

interface ModalOrderDetailsProps {
  order: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onApproveQuotation: (orderId: string, quotationId: string) => void;
  onGenerateQuotations: (orderId: string) => void;
}

export const ModalOrderDetails: React.FC<ModalOrderDetailsProps> = ({ 
  order, 
  isOpen, 
  onClose,
  onApproveQuotation,
  onGenerateQuotations
}) => {
  const [activeTab, setActiveTab] = useState<'detalhes' | 'cotacoes'>('detalhes');

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-5 bg-gray-50">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">{order.number}</h3>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm text-gray-500 mt-1">Criado em {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b bg-white">
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'detalhes' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('detalhes')}
            >
              Detalhes do Pedido
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'cotacoes' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('cotacoes')}
            >
              Cotações ({order.quotations.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            {activeTab === 'detalhes' ? (
              <div className="space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Solicitante</p>
                      <p className="text-base text-gray-900">{order.requester}</p>
                      <p className="text-sm text-gray-500">{order.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Prioridade</p>
                      <StatusBadge status={order.priority} type="priority" />
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Valor Estimado</p>
                      <p className="text-base font-semibold text-gray-900">
                        R$ {order.estimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qtd</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Un. (Est.)</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            R$ {(item.unitPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            R$ {(item.quantity * (item.unitPrice || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                 {/* Quotation Logic */}
                 {order.status === 'rascunho' && (
                   <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                     <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                     <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma cotação iniciada</h3>
                     <p className="mt-1 text-sm text-gray-500">Inicie o processo para contatar fornecedores.</p>
                     <div className="mt-6">
                       <button
                         onClick={() => onGenerateQuotations(order.id)}
                         className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                       >
                         Solicitar Cotações aos Fornecedores
                       </button>
                     </div>
                   </div>
                 )}

                 {(order.status === 'em_cotacao' || order.status === 'aprovado') && (
                   <div className="space-y-4">
                     <div className="grid gap-4">
                       {order.quotations.map((quote) => (
                         <div 
                            key={quote.id} 
                            className={`
                              relative border rounded-lg p-5 transition-all
                              ${quote.status === 'vencedora' ? 'border-green-200 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:border-blue-300 bg-white'}
                            `}
                          >
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                               <div className="h-10 w-10 bg-white border rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                                 {quote.supplierName.charAt(0)}
                               </div>
                               <div>
                                 <h4 className="text-base font-semibold text-gray-900">{quote.supplierName}</h4>
                                 <div className="flex items-center text-sm text-gray-500 gap-3">
                                   <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Entrega: {new Date(quote.deliveryDate).toLocaleDateString()}</span>
                                 </div>
                               </div>
                             </div>
                             
                             <div className="text-right">
                               <p className="text-2xl font-bold text-gray-900">
                                 R$ {quote.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                               </p>
                               {quote.status === 'vencedora' ? (
                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                   Cotação Aprovada
                                 </span>
                               ) : order.status !== 'aprovado' && (
                                 <button
                                   onClick={() => onApproveQuotation(order.id, quote.id)}
                                   className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary hover:bg-primary-dark transition-colors"
                                 >
                                   Aprovar Cotação
                                 </button>
                               )}
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
        </div>
      </div>
    </div>
  );
};
