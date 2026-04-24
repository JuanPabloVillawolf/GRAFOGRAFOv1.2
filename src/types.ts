export type Category = 'Libros' | 'Bebidas' | 'Snacks' | 'Otros';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  icon: string;
}

export interface Sale {
  id: string;
  timestamp: string;
  productName: string;
  category: string;
  amount: number;
  quantity: number;
  paymentMethod: string;
  username: string;
}

export interface PendingAccount {
  id: string;
  customerName: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    category: string;
  }[];
  payments?: {
    method: string;
    amount: number;
    timestamp: string;
  }[];
  status: 'Abierta' | 'Pagada';
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  timestamp: string;
  productId: string;
  productName: string;
  type: string;
  quantity: number;
  stockResult: number;
  notes: string;
  username: string;
}

export interface Expense {
  id: string;
  timestamp: string;
  description: string;
  amount: number;
  category: string;
  username: string;
  notes: string;
}

export interface CashLog {
  timestamp: string;
  username: string;
  type: string;
  amount: number;
  notes: string;
}
