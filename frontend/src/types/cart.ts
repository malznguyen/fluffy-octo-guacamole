// Cart-related type definitions

// Cart item
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
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
    price: number;
    stock: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Cart
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Add to cart request
export interface AddToCartRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

// Update cart item request
export interface UpdateCartItemRequest {
  quantity: number;
}
