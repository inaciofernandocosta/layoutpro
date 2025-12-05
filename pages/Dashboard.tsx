import React from 'react';
import { PurchaseOrder } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingBag, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DashboardProps {
  orders: PurchaseOrder[];
}

export const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  // Calculate Stats
  const totalOrders = orders.length;
  const totalValue = orders.reduce((acc, curr) => acc + (curr.finalValue || curr.estimatedValue), 0);
  const approvedOrders = orders.filter(o => o.status === 'aprovado').length;
  const pendingOrders = orders.filter(o => o.status === 'em_cotacao').length;

  // Prepare chart data (group by Month for demo, mock logic)
  const chartData = [
    { name: 'Jan', total: 1200 },
    { name: 'Fev', total: 2100 },
    { name: 'Mar', total: 800 },
    { name: 'Abr', total: 1600 },
    { name: 'Mai', total: totalValue }, // Current month dynamic
    { name: 'Jun', total: 0 },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total em Pedidos" 
          value={`R$ ${totalValue.toLocaleString('pt-BR')}`} 
          icon={TrendingUp} 
          colorClass="bg-primary"
          subtext="No mês atual"
        />
        <StatCard 
          title="Pedidos Totais" 
          value={totalOrders} 
          icon={ShoppingBag} 
          colorClass="bg-blue-500"
        />
        <StatCard 
          title="Aprovados" 
          value={approvedOrders} 
          icon={CheckCircle} 
          colorClass="bg-green-500"
        />
        <StatCard 
          title="Em Cotação" 
          value={pendingOrders} 
          icon={Clock} 
          colorClass="bg-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Volume de Compras (Semestral)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="total" fill="#29839F" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Atenção Necessária</h3>
          <div className="space-y-4">
             {orders.filter(o => o.status === 'em_cotacao').length > 0 ? (
               orders.filter(o => o.status === 'em_cotacao').map(order => (
                 <div key={order.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Aprovar Cotação</p>
                      <p className="text-xs text-blue-700 mt-0.5">Pedido {order.number} aguarda decisão.</p>
                    </div>
                 </div>
               ))
             ) : (
               <p className="text-sm text-gray-500">Nenhuma pendência urgente.</p>
             )}
             
             {orders.filter(o => o.status === 'rascunho').map(order => (
                 <div key={order.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Enviar para Fornecedores</p>
                      <p className="text-xs text-gray-500 mt-0.5">Rascunho {order.number} pendente.</p>
                    </div>
                 </div>
               ))}
          </div>
        </div>
      </div>
    </div>
  );
};
