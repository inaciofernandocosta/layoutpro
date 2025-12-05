import React from 'react';
import { OrderStatus, Priority } from '../types';

interface StatusBadgeProps {
  status: OrderStatus | Priority | string;
  type?: 'status' | 'priority';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'status' }) => {
  const getStyles = () => {
    if (type === 'priority') {
      switch (status) {
        case 'alta': return 'bg-red-100 text-red-700 border-red-200';
        case 'media': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'baixa': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-gray-100 text-gray-700';
      }
    }

    switch (status) {
      case 'aprovado':
      case 'vencedora':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'em_cotacao':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rascunho':
      case 'pendente':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'cancelado':
      case 'rejeitada':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'concluido':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getLabel = () => {
    const labels: Record<string, string> = {
      rascunho: 'Rascunho',
      em_cotacao: 'Em Cotação',
      aprovado: 'Aprovado',
      cancelado: 'Cancelado',
      concluido: 'Concluído',
      alta: 'Alta',
      media: 'Média',
      baixa: 'Baixa',
      vencedora: 'Vencedora',
      rejeitada: 'Rejeitada',
      pendente: 'Pendente'
    };
    return labels[status] || status;
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}>
      {getLabel()}
    </span>
  );
};
