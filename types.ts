export type OrderStatus = 'rascunho' | 'em_cotacao' | 'aprovado' | 'cancelado' | 'concluido';
export type Priority = 'alta' | 'media' | 'baixa';

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  referencePrice: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice?: number; // Estimated or final price
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
}

export interface Quotation {
  id: string;
  supplierId: string;
  supplierName: string;
  totalValue: number;
  status: 'pendente' | 'vencedora' | 'rejeitada';
  deliveryDate: string;
}

export interface PurchaseOrder {
  id: string;
  number: string;
  requester: string;
  department: string;
  date: string;
  status: OrderStatus;
  priority: Priority;
  items: OrderItem[];
  estimatedValue: number;
  finalValue?: number;
  selectedQuotationId?: string;
  quotations: Quotation[];
  notes?: string;
}
