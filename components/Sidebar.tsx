import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  Boxes
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Pedidos de Compra', icon: ShoppingCart },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'suppliers', label: 'Fornecedores', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto flex flex-col
      `}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Boxes className="w-8 h-8 text-primary-light mr-3" />
        <div>
          <h1 className="font-bold text-lg tracking-wide">LayoutPro</h1>
          <p className="text-xs text-gray-400">Gestão de Compras</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`
                w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group
                ${isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
                }
              `}
            >
              <Icon 
                className={`
                  mr-3 h-5 w-5 transition-colors
                  ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                `} 
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-sidebar-hover hover:text-white transition-colors">
          <Settings className="mr-3 h-5 w-5 text-gray-400" />
          Configurações
        </button>
        <button className="w-full flex items-center px-3 py-2 mt-1 text-sm font-medium text-red-300 rounded-lg hover:bg-red-900/30 transition-colors">
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  );
};
