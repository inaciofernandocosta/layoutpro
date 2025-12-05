import { PurchaseOrder, Product, Supplier } from '../types';

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Papel A4 (Caixa)', category: 'Escritório', unit: 'cx', referencePrice: 180.00 },
  { id: 'p2', name: 'Toner HP 85A', category: 'Informática', unit: 'un', referencePrice: 85.00 },
  { id: 'p3', name: 'Caneta Esferográfica Azul', category: 'Escritório', unit: 'cx', referencePrice: 12.50 },
  { id: 'p4', name: 'Mouse USB Logitech', category: 'Periféricos', unit: 'un', referencePrice: 45.00 },
  { id: 'p5', name: 'Cadeira Giratória Ergonômica', category: 'Móveis', unit: 'un', referencePrice: 450.00 },
  { id: 'p6', name: 'Monitor 24" Dell', category: 'Periféricos', unit: 'un', referencePrice: 890.00 },
];

export const mockSuppliers: Supplier[] = [
  { id: 's1', name: 'Papelaria Central', rating: 4.5, deliveryTime: '2 dias' },
  { id: 's2', name: 'Tech Suprimentos', rating: 4.8, deliveryTime: '1 dia' },
  { id: 's3', name: 'Móveis & Cia', rating: 4.2, deliveryTime: '5 dias' },
  { id: 's4', name: 'Office Total', rating: 4.0, deliveryTime: '3 dias' },
];

export const mockOrders: PurchaseOrder[] = [
  {
    id: '1',
    number: 'PC-2024-001',
    requester: 'Ana Silva',
    department: 'RH',
    date: '2024-05-10',
    status: 'aprovado',
    priority: 'alta',
    estimatedValue: 630.00,
    finalValue: 600.00,
    selectedQuotationId: 'q1',
    items: [
      { id: 'i1', productId: 'p1', productName: 'Papel A4 (Caixa)', quantity: 2, unitPrice: 180.00 },
      { id: 'i2', productId: 'p3', productName: 'Caneta Esferográfica Azul', quantity: 5, unitPrice: 12.00 }
    ],
    quotations: [
      { id: 'q1', supplierId: 's1', supplierName: 'Papelaria Central', totalValue: 600.00, status: 'vencedora', deliveryDate: '2024-05-12' },
      { id: 'q2', supplierId: 's4', supplierName: 'Office Total', totalValue: 650.00, status: 'rejeitada', deliveryDate: '2024-05-13' }
    ]
  },
  {
    id: '2',
    number: 'PC-2024-002',
    requester: 'Carlos Santos',
    department: 'TI',
    date: '2024-05-11',
    status: 'em_cotacao',
    priority: 'media',
    estimatedValue: 1780.00,
    items: [
      { id: 'i3', productId: 'p6', productName: 'Monitor 24" Dell', quantity: 2, unitPrice: 890.00 }
    ],
    quotations: [
      { id: 'q3', supplierId: 's2', supplierName: 'Tech Suprimentos', totalValue: 1750.00, status: 'pendente', deliveryDate: '2024-05-15' },
      { id: 'q4', supplierId: 's4', supplierName: 'Office Total', totalValue: 1800.00, status: 'pendente', deliveryDate: '2024-05-16' }
    ]
  },
  {
    id: '3',
    number: 'PC-2024-003',
    requester: 'Roberto Costa',
    department: 'Vendas',
    date: '2024-05-12',
    status: 'rascunho',
    priority: 'baixa',
    estimatedValue: 450.00,
    items: [
      { id: 'i4', productId: 'p5', productName: 'Cadeira Giratória Ergonômica', quantity: 1, unitPrice: 450.00 }
    ],
    quotations: []
  },
  {
    id: '4',
    number: 'PC-2024-004',
    requester: 'Fernanda Lima',
    department: 'Marketing',
    date: '2024-05-12',
    status: 'em_cotacao',
    priority: 'alta',
    estimatedValue: 180.00,
    items: [
       { id: 'i5', productId: 'p2', productName: 'Toner HP 85A', quantity: 2, unitPrice: 90.00 }
    ],
    quotations: []
  }
];
