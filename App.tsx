import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { OrderList } from './pages/OrderList';
import { ModalNewOrder } from './components/ModalNewOrder';
import { ModalOrderDetails } from './components/ModalOrderDetails';
import { mockOrders, mockSuppliers } from './data/mockData';
import { PurchaseOrder, Quotation } from './types';
import { Menu, Bell } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockOrders);
  
  // Modal States
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Actions
  const handleNewOrder = (orderData: any) => {
    const newOrder: PurchaseOrder = {
      id: Math.random().toString(36).substr(2, 9),
      number: `PC-2024-00${orders.length + 1}`,
      date: new Date().toISOString(),
      status: 'rascunho',
      quotations: [],
      ...orderData
    };
    setOrders([newOrder, ...orders]);
    setCurrentView('orders'); // Switch to list to see new item
  };

  const handleGenerateQuotations = (orderId: string) => {
    // Mock logic to simulate generating quotes from suppliers
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        const quotes: Quotation[] = mockSuppliers.slice(0, 2).map((supplier, idx) => ({
          id: `q-${Math.random().toString(36)}`,
          supplierId: supplier.id,
          supplierName: supplier.name,
          totalValue: order.estimatedValue * (idx === 0 ? 0.95 : 1.05), // Random variation
          status: 'pendente',
          deliveryDate: new Date(Date.now() + 86400000 * (idx + 2)).toISOString()
        }));
        return { ...order, status: 'em_cotacao', quotations: quotes };
      }
      return order;
    }));
    
    // Update the selected order in view immediately
    const updated = orders.find(o => o.id === orderId);
    if(updated && selectedOrder?.id === orderId) {
       // Since state update is async, we reconstruct what we expect
       // In a real app, we'd refetch or use a more robust state manager
       // For this demo, we'll force close/reopen or simple alert?
       // Better: Just update the modal's data source if it was tied to 'orders', 
       // but here 'selectedOrder' is a separate state clone. 
       // Let's rely on finding it in the next render cycle or simple hack:
       setIsDetailsModalOpen(false);
       setTimeout(() => alert('Cotações solicitadas com sucesso! Verifique o status.'), 100);
    }
  };

  const handleApproveQuotation = (orderId: string, quotationId: string) => {
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        const updatedQuotes = order.quotations.map(q => ({
          ...q,
          status: q.id === quotationId ? 'vencedora' : 'rejeitada'
        })) as Quotation[];
        
        const winner = updatedQuotes.find(q => q.status === 'vencedora');

        return { 
          ...order, 
          status: 'aprovado', 
          quotations: updatedQuotes,
          finalValue: winner?.totalValue,
          selectedQuotationId: winner?.id
        };
      }
      return order;
    }));
    setIsDetailsModalOpen(false);
  };

  const handleViewDetails = (order: PurchaseOrder) => {
    // Always get fresh data from state
    const freshOrder = orders.find(o => o.id === order.id) || order;
    setSelectedOrder(freshOrder);
    setIsDetailsModalOpen(true);
  };

  // Topbar Title Helper
  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Visão Geral';
      case 'orders': return 'Pedidos de Compra';
      case 'products': return 'Catálogo de Produtos';
      case 'suppliers': return 'Base de Fornecedores';
      case 'reports': return 'Relatórios Gerenciais';
      default: return 'LayoutPro';
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f4f6] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 z-30">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Gestor de Compras</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {currentView === 'dashboard' && <Dashboard orders={orders} />}
            
            {currentView === 'orders' && (
              <OrderList 
                orders={orders} 
                onNewOrder={() => setIsNewOrderModalOpen(true)}
                onViewDetails={handleViewDetails}
              />
            )}

            {(currentView === 'products' || currentView === 'suppliers' || currentView === 'reports') && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300 p-12">
                <p className="text-lg font-medium">Módulo em Desenvolvimento</p>
                <p className="text-sm mt-2">Esta funcionalidade está sendo implementada no LayoutPro.</p>
                <button 
                  onClick={() => setCurrentView('orders')}
                  className="mt-4 px-4 py-2 text-sm text-primary hover:underline"
                >
                  Voltar para Pedidos
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <ModalNewOrder 
        isOpen={isNewOrderModalOpen} 
        onClose={() => setIsNewOrderModalOpen(false)}
        onSubmit={handleNewOrder}
      />

      <ModalOrderDetails
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
        onGenerateQuotations={handleGenerateQuotations}
        onApproveQuotation={handleApproveQuotation}
      />
    </div>
  );
};

export default App;
