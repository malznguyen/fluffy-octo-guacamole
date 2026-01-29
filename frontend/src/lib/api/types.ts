export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  children?: Category[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: number;
  size?: string;
  color?: string;
  sku: string;
  price: number;
  stockQuantity: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  salePrice?: number;
  categoryId: number;
  categoryName?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  variantId?: number;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: "USER" | "ADMIN";
}

export interface OrderItem {
  id: number;
  productName: string;
  productImage?: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderCode: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: "COD" | "BANK_TRANSFER";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
