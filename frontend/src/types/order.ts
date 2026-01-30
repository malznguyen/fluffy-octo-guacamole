// Order-related type definitions

import { OrderStatus, PaymentMethod, PaymentStatus } from './enums';

// Order item
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    images: Array<{
      id: string;
      imageUrl: string;
      isPrimary: boolean;
    }>;
  };
  variant?: {
    id: string;
    size: string;
    color: string;
  };
  createdAt: string;
}

// Payment
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Order
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  payment?: Payment;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

// Create order request
export interface CreateOrderRequest {
  shippingAddress: string;
}

// Update order status request
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// Confirm payment request
export interface ConfirmPaymentRequest {
  transactionId: string;
}

// Mark payment failed request
export interface MarkPaymentFailedRequest {
  reason: string;
}
