import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { OrderItem, Product } from '../types';

interface ModalNewOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
}

export const ModalNewOrder: React.FC<ModalNewOrderProps> = ({ isOpen, onClose, onSubmit }) => {
  const [department, setDepartment] = useState('TI');
  const [priority, setPriority] = useState('media');
  const [requester, setRequester] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!selectedProduct) return;
    
    const product = mockProducts.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      productName: product.name,
      quantity: quantity,
      unitPrice: product.referencePrice
    };

    setItems([...items, newItem]);
    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.quantity * (item.unitPrice || 0)), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Adicione pelo menos um item ao pedido.');
      return;
    }
    onSubmit({
      requester,
      department,
      priority,
      items,
      estimatedValue: calculateTotal()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        {/* Modal Panel */}
        <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl transform transition-all">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Novo Pedido de Compra</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Solicitante</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="Seu nome"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Departamento</label>
                <select
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="TI">Tecnologia (TI)</option>
                  <option value="RH">Recursos Humanos</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Vendas">Vendas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                <select
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            {/* Items Section */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Adicionar Produtos</h4>
              <div className="flex gap-3 mb-4">
                <select
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Selecione um produto...</option>
                  {mockProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - R$ {p.referencePrice}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Items List */}
              {items.length > 0 ? (
                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qtd</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.productName}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            R$ {(item.quantity * (item.unitPrice || 0)).toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum item adicionado.</p>
              )}
              
              {items.length > 0 && (
                <div className="mt-3 text-right">
                  <span className="text-sm font-medium text-gray-700">Total Estimado: </span>
                  <span className="text-lg font-bold text-primary">R$ {calculateTotal().toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark shadow-sm"
              >
                Criar Pedido
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};