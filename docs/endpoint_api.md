# FashOn API Documentation

**Version**: 1.0  
**Base URL**: `/api/v1`  
**Authentication**: Bearer Token (JWT)

---

## Table of Contents

1. [Common Response Format](#common-response-format)
2. [Enums Reference](#enums-reference)
3. [Authentication & Profile](#1-authentication--profile)
4. [Public Products & Categories](#2-public-products--categories)
5. [Cart & Checkout](#3-cart--checkout)
6. [Customer Orders & Payments](#4-customer-orders--payments)
7. [Admin Management](#5-admin-management)

---

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "fieldName": "Error message"
  },
  "timestamp": "2026-01-30T08:00:00"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "content": [ ... ],
    "totalElements": 100,
    "totalPages": 10,
    "currentPage": 0,
    "size": 10
  }
}
```

---

## Enums Reference

### Role
- `CUSTOMER` - Regular customer
- `ADMIN` - Administrator

### OrderStatus
- `PENDING` - Waiting for confirmation
- `CONFIRMED` - Confirmed by admin
- `SHIPPED` - Out for delivery
- `DELIVERED` - Delivered to customer
- `COMPLETED` - Order completed
- `CANCELLED` - Cancelled

### PaymentMethod
- `COD` - Cash on delivery
- `BANK_TRANSFER` - Bank transfer

### PaymentStatus
- `PENDING` - Waiting for payment
- `PAID` - Payment received
- `FAILED` - Payment failed
- `REFUNDED` - Refunded

---

## 1. Authentication & Profile

### [POST] `/api/v1/auth/register`
**Description**: Register a new customer account.
**Security**: Public (no authentication required)

#### Request Body (JSON)
```json
{
  "email": "string (required, email format)",
  "password": "string (required, min 6 characters)",
  "fullName": "string (required, max 255 characters)",
  "phone": "string (optional)"
}
```

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "token": "string (JWT)",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "role": "CUSTOMER"
  },
  "message": "User registered successfully"
}
```

---

### [POST] `/api/v1/auth/login`
**Description**: Authenticate user and get JWT token.
**Security**: Public (no authentication required)

#### Request Body (JSON)
```json
{
  "email": "string (required, email format)",
  "password": "string (required)"
}
```

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "token": "string (JWT)",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "role": "CUSTOMER"
  },
  "message": "Login successful"
}
```

---

### [GET] `/api/v1/users/me`
**Description**: Get current user profile.
**Security**: Bearer Authentication required

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "phone": "0901234567",
    "avatarUrl": "string",
    "role": "CUSTOMER",
    "createdAt": "2026-01-30T08:00:00",
    "updatedAt": "2026-01-30T08:00:00"
  }
}
```

---

### [PUT] `/api/v1/users/me`
**Description**: Update current user profile.
**Security**: Bearer Authentication required

#### Request Body (JSON)
```json
{
  "fullName": "string (required, max 255 characters)",
  "phone": "string (optional)",
  "avatarUrl": "string (optional)"
}
```

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Updated Name",
    "phone": "0901234567",
    "avatarUrl": "string",
    "role": "CUSTOMER",
    "createdAt": "2026-01-30T08:00:00",
    "updatedAt": "2026-01-30T08:00:00"
  },
  "message": "Profile updated successfully"
}
```

---

### [DELETE] `/api/v1/users/me`
**Description**: Soft delete the current user account.
**Security**: Bearer Authentication required

#### Response Body (JSON)
```json
{
  "success": true,
  "data": null,
  "message": "Account deleted successfully"
}
```

---

## 2. Public Products & Categories

### [GET] `/api/v1/public/products`
**Description**: Get paginated list of visible products with optional filters.
**Security**: Public (no authentication required)

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number (0-based) |
| size | integer | No | 20 | Page size |
| sortBy | string | No | createdAt | Sort field (name, price, createdAt, soldCount) |
| sortDir | string | No | desc | Sort direction (asc, desc) |
| categoryId | long | No | - | Filter by category ID |
| minPrice | decimal | No | - | Minimum price filter |
| maxPrice | decimal | No | - | Maximum price filter |
| search | string | No | - | Search by name or description |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Product Name",
        "slug": "product-name",
        "description": "Product description",
        "basePrice": 100000.00,
        "categoryId": 1,
        "categoryName": "Category Name",
        "isVisible": true,
        "soldCount": 10,
        "createdAt": "2026-01-30T08:00:00",
        "updatedAt": "2026-01-30T08:00:00",
        "images": [
          {
            "id": 1,
            "imageUrl": "/uploads/image.jpg",
            "altText": "Product image",
            "sortOrder": 0,
            "isPrimary": true
          }
        ],
        "variants": [
          {
            "id": 1,
            "sku": "SKU001",
            "color": "Red",
            "size": "M",
            "stockQuantity": 100,
            "priceAdjustment": 0.00,
            "finalPrice": 100000.00,
            "isAvailable": true,
            "inStock": true
          }
        ]
      }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "currentPage": 0,
    "size": 20
  }
}
```

---

### [GET] `/api/v1/public/products/{slug}`
**Description**: Get detailed product information by slug including variants and images.
**Security**: Public (no authentication required)

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| slug | string | Product slug |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Product Name",
    "slug": "product-name",
    "description": "Product description",
    "basePrice": 100000.00,
    "categoryId": 1,
    "categoryName": "Category Name",
    "isVisible": true,
    "soldCount": 10,
    "createdAt": "2026-01-30T08:00:00",
    "updatedAt": "2026-01-30T08:00:00",
    "images": [
      {
        "id": 1,
        "imageUrl": "/uploads/image.jpg",
        "altText": "Product image",
        "sortOrder": 0,
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": 1,
        "sku": "SKU001",
        "color": "Red",
        "size": "M",
        "stockQuantity": 100,
        "priceAdjustment": 0.00,
        "finalPrice": 100000.00,
        "isAvailable": true,
        "inStock": true
      }
    ]
  }
}
```

---

### [GET] `/api/v1/public/products/newest`
**Description**: Get newest products for homepage display.
**Security**: Public (no authentication required)

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | integer | No | 10 | Number of products to return |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "slug": "product-name",
      "description": "Product description",
      "basePrice": 100000.00,
      "categoryId": 1,
      "categoryName": "Category Name",
      "isVisible": true,
      "soldCount": 10,
      "createdAt": "2026-01-30T08:00:00",
      "updatedAt": "2026-01-30T08:00:00",
      "images": [],
      "variants": []
    }
  ]
}
```

---

### [GET] `/api/v1/public/products/top-selling`
**Description**: Get top selling products for homepage display.
**Security**: Public (no authentication required)

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | integer | No | 10 | Number of products to return |

#### Response Body (JSON)
Same as `/api/v1/public/products/newest`

---

### [GET] `/api/v1/public/categories`
**Description**: Get all active categories for menu display.
**Security**: Public (no authentication required)

#### Response Body (JSON)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Category Name",
      "slug": "category-name",
      "description": "Category description",
      "parentId": null,
      "parentName": null,
      "sortOrder": 0,
      "isActive": true,
      "children": []
    }
  ]
}
```

---

### [GET] `/api/v1/public/categories/tree`
**Description**: Get categories as hierarchical tree structure for menu.
**Security**: Public (no authentication required)

#### Response Body (JSON)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Parent Category",
      "slug": "parent-category",
      "description": "Description",
      "parentId": null,
      "parentName": null,
      "sortOrder": 0,
      "isActive": true,
      "children": [
        {
          "id": 2,
          "name": "Child Category",
          "slug": "child-category",
          "description": "Description",
          "parentId": 1,
          "parentName": "Parent Category",
          "sortOrder": 0,
          "isActive": true,
          "children": []
        }
      ]
    }
  ]
}
```

---

## 3. Cart & Checkout

### [GET] `/api/v1/cart`
**Description**: Get the current user's shopping cart with all items.
**Security**: Bearer Authentication required

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "items": [
      {
        "id": 1,
        "variantId": 1,
        "productName": "Product Name",
        "color": "Red",
        "size": "M",
        "sku": "SKU001",
        "quantity": 2,
        "unitPrice": 100000.00,
        "subtotal": 200000.00,
        "imageUrl": "/uploads/image.jpg",
        "createdAt": "2026-01-30T08:00:00",
        "updatedAt": "2026-01-30T08:00:00"
      }
    ],
    "totalItems": 2,
    "totalAmount": 200000.00,
    "createdAt": "2026-01-30T08:00:00",
    "updatedAt": "2026-01-30T08:00:00"
  }
}
```

---

### [POST] `/api/v1/cart/items`
**Description**: Add a product variant to the shopping cart.
**Security**: Bearer Authentication required

#### Request Body (JSON)
```json
{
  "variantId": 1,
  "quantity": 2
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| variantId | long | Yes | Not null |
| quantity | integer | Yes | Not null, min 1 |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "items": [ ... ],
    "totalItems": 2,
    "totalAmount": 200000.00,
    "createdAt": "2026-01-30T08:00:00",
    "updatedAt": "2026-01-30T08:00:00"
  },
  "message": "Item added to cart successfully"
}
```

---

### [PUT] `/api/v1/cart/items/{id}`
**Description**: Update the quantity of a cart item.
**Security**: Bearer Authentication required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Cart item ID |

#### Request Body (JSON)
```json
{
  "quantity": 3
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| quantity | integer | Yes | Not null, min 1 |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "items": [ ... ],
    "totalItems": 3,
    "totalAmount": 300000.00,
    "createdAt": "2026-01-30T08:00:00",
    "updatedAt": "2026-01-30T08:00:00"
  },
  "message": "Cart item updated successfully"
}
```

---

### [DELETE] `/api/v1/cart/items/{id}`
**Description**: Remove a specific item from the shopping cart.
**Security**: Bearer Authentication required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Cart item ID |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "items": [],
    "totalItems": 0,
    "totalAmount": 0.00,
    "createdAt": "2026-01-30T08:00:00",
    "updatedAt": "2026-01-30T08:00:00"
  },
  "message": "Item removed from cart successfully"
}
```

---

### [POST] `/api/v1/orders`
**Description**: Create a new order from the current shopping cart.
**Security**: Bearer Authentication required

#### Request Body (JSON)
```json
{
  "shippingAddress": "string (required, max 500 characters)",
  "phone": "string (required, 10-15 digits)",
  "note": "string (optional, max 500 characters)",
  "paymentMethod": "COD | BANK_TRANSFER"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| shippingAddress | string | Yes | Not blank, max 500 |
| phone | string | Yes | Not blank, pattern: ^[0-9]{10,15}$ |
| note | string | No | Max 500 |
| paymentMethod | enum | Yes | Not null (COD, BANK_TRANSFER) |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderCode": "ORD-20260130-ABC123",
    "userId": 1,
    "customerName": "Nguyen Van A",
    "customerEmail": "user@example.com",
    "total": 200000.00,
    "status": "PENDING",
    "shippingAddress": "123 Street, District 1, HCMC",
    "phone": "0901234567",
    "note": "Leave at front door",
    "items": [
      {
        "id": 1,
        "productNameSnapshot": "Product Name",
        "variantInfoSnapshot": "Red - M",
        "quantity": 2,
        "unitPrice": 100000.00,
        "subtotal": 200000.00,
        "createdAt": "2026-01-30T08:00:00",
        "updatedAt": "2026-01-30T08:00:00"
      }
    ],
    "totalItems": 2,
    "createdAt": "2026-01-30T08:00:00",
    "updatedAt": "2026-01-30T08:00:00"
  },
  "message": "Order created successfully",
  "orderCode": "ORD-20260130-ABC123"
}
```

---

## 4. Customer Orders & Payments

### [GET] `/api/v1/orders`
**Description**: Get order history for the current user with pagination.
**Security**: Bearer Authentication required

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number (0-based) |
| size | integer | No | 10 | Page size |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "orderCode": "ORD-20260130-ABC123",
        "userId": 1,
        "customerName": "Nguyen Van A",
        "customerEmail": "user@example.com",
        "total": 200000.00,
        "status": "PENDING",
        "shippingAddress": "123 Street, District 1, HCMC",
        "phone": "0901234567",
        "note": "Leave at front door",
        "items": [ ... ],
        "totalItems": 2,
        "createdAt": "2026-01-30T08:00:00",
        "updatedAt": "2026-01-30T08:00:00"
      }
    ],
    "totalElements": 10,
    "totalPages": 1,
    "currentPage": 0,
    "size": 10
  }
}
```

---

### [GET] `/api/v1/orders/{orderCode}`
**Description**: Get detailed information about a specific order.
**Security**: Bearer Authentication required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| orderCode | string | Order code (e.g., ORD-20260130-ABC123) |

#### Response Body (JSON)
Same as POST `/api/v1/orders` response data structure.

---

### [POST] `/api/v1/orders/{orderCode}/cancel`
**Description**: Cancel an order if it hasn't been shipped yet.
**Security**: Bearer Authentication required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| orderCode | string | Order code |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderCode": "ORD-20260130-ABC123",
    "status": "CANCELLED",
    ...
  },
  "message": "Order cancelled successfully"
}
```

---

### [GET] `/api/v1/orders/{orderCode}/payments`
**Description**: View payment history for a specific order.
**Security**: Bearer Authentication required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| orderCode | string | Order code |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderId": 1,
      "orderCode": "ORD-20260130-ABC123",
      "method": "COD",
      "amount": 200000.00,
      "status": "PENDING",
      "transactionCode": null,
      "paidAt": null,
      "notes": null,
      "createdAt": "2026-01-30T08:00:00",
      "updatedAt": "2026-01-30T08:00:00"
    }
  ],
  "count": 1
}
```

---

## 5. Admin Management

**Note**: All admin endpoints require `ADMIN` role.

### 5.1 Products

### [GET] `/api/v1/admin/products`
**Description**: Get all products including hidden ones (flat list, no pagination).
**Security**: Bearer Authentication + ADMIN role required

#### Response Body (JSON)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "slug": "product-name",
      "description": "Product description",
      "basePrice": 100000.00,
      "categoryId": 1,
      "categoryName": "Category Name",
      "isVisible": true,
      "soldCount": 10,
      "createdAt": "2026-01-30T08:00:00",
      "updatedAt": "2026-01-30T08:00:00",
      "images": [ ... ],
      "variants": [ ... ]
    }
  ]
}
```

---

### [GET] `/api/v1/admin/products/{id}`
**Description**: Get a specific product by its ID.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Product ID |

#### Response Body (JSON)
Same as GET `/api/v1/admin/products` item structure.

---

### [POST] `/api/v1/admin/products`
**Description**: Create a new product with variants and images.
**Security**: Bearer Authentication + ADMIN role required

#### Request Body (JSON)
```json
{
  "name": "string (required, max 500 characters)",
  "slug": "string (required, max 500 characters)",
  "description": "string (optional)",
  "basePrice": 100000.00,
  "categoryId": 1,
  "isVisible": true,
  "variants": [
    {
      "sku": "string (required, max 100 characters)",
      "color": "string (optional, max 50 characters)",
      "size": "string (optional, max 20 characters)",
      "stockQuantity": 100,
      "priceAdjustment": 0.00,
      "isAvailable": true
    }
  ],
  "images": [
    {
      "imageUrl": "string (required, max 1000 characters)",
      "altText": "string (optional, max 255 characters)",
      "sortOrder": 0,
      "isPrimary": true
    }
  ]
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | Not blank, max 500 |
| slug | string | Yes | Not blank, max 500 |
| description | string | No | - |
| basePrice | decimal | Yes | Not null, positive |
| categoryId | long | Yes | Not null |
| isVisible | boolean | No | - |
| variants | array | No | Valid CreateVariantRequest objects |
| images | array | No | Valid CreateImageRequest objects |

**CreateVariantRequest Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| sku | string | Yes | Not blank, max 100 |
| color | string | No | Max 50 |
| size | string | No | Max 20 |
| stockQuantity | integer | Yes | Not null, min 0 |
| priceAdjustment | decimal | No | - |
| isAvailable | boolean | No | - |

**CreateImageRequest Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| imageUrl | string | Yes | Not blank, max 1000 |
| altText | string | No | Max 255 |
| sortOrder | integer | Yes | Not null |
| isPrimary | boolean | No | - |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Product Name",
    ...
  },
  "message": "Product created successfully"
}
```

---

### [PUT] `/api/v1/admin/products/{id}`
**Description**: Update an existing product.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Product ID |

#### Request Body (JSON)
Same as POST `/api/v1/admin/products` but all fields are optional.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | No | Max 500 |
| slug | string | No | Max 500 |
| description | string | No | - |
| basePrice | decimal | No | Positive |
| categoryId | long | No | - |
| isVisible | boolean | No | - |
| variants | array | No | Valid CreateVariantRequest objects |
| images | array | No | Valid CreateImageRequest objects |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Name",
    ...
  },
  "message": "Product updated successfully"
}
```

---

### [DELETE] `/api/v1/admin/products/{id}`
**Description**: Soft delete a product and its variants/images.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Product ID |

#### Response Body (JSON)
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### [POST] `/api/v1/admin/products/{productId}/variants`
**Description**: Add a new variant to an existing product.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| productId | long | Product ID |

#### Request Body (JSON)
```json
{
  "sku": "string (required, max 100 characters)",
  "color": "string (optional, max 50 characters)",
  "size": "string (optional, max 20 characters)",
  "stockQuantity": 100,
  "priceAdjustment": 0.00,
  "isAvailable": true
}
```

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Product Name",
    "variants": [ ... ],
    ...
  },
  "message": "Variant added successfully"
}
```

---

### [POST] `/api/v1/admin/products/{productId}/images`
**Description**: Add a new image to an existing product.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| productId | long | Product ID |

#### Request Body (JSON)
```json
{
  "imageUrl": "string (required, max 1000 characters)",
  "altText": "string (optional, max 255 characters)",
  "sortOrder": 0,
  "isPrimary": true
}
```

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Product Name",
    "images": [ ... ],
    ...
  },
  "message": "Image added successfully"
}
```

---

### [POST] `/api/v1/admin/products/upload-image`
**Description**: Upload an image file and return the file path.
**Security**: Bearer Authentication + ADMIN role required
**Content-Type**: `multipart/form-data`

#### Request Body (Form Data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | file | Yes | Image file to upload |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "filename": "image-uuid.jpg",
    "url": "/uploads/image-uuid.jpg"
  },
  "message": "Image uploaded successfully"
}
```

---

### 5.2 Categories

### [GET] `/api/v1/admin/categories`
**Description**: Get all categories as flat list.
**Security**: Bearer Authentication + ADMIN role required

#### Response Body (JSON)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Category Name",
      "slug": "category-name",
      "description": "Description",
      "parentId": null,
      "parentName": null,
      "sortOrder": 0,
      "isActive": true,
      "children": []
    }
  ]
}
```

---

### [GET] `/api/v1/admin/categories/tree`
**Description**: Get categories as hierarchical tree structure.
**Security**: Bearer Authentication + ADMIN role required

#### Response Body (JSON)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Parent Category",
      "slug": "parent-category",
      "description": "Description",
      "parentId": null,
      "parentName": null,
      "sortOrder": 0,
      "isActive": true,
      "children": [
        {
          "id": 2,
          "name": "Child Category",
          "slug": "child-category",
          "description": "Description",
          "parentId": 1,
          "parentName": "Parent Category",
          "sortOrder": 0,
          "isActive": true,
          "children": []
        }
      ]
    }
  ]
}
```

---

### [GET] `/api/v1/admin/categories/{id}`
**Description**: Get a specific category by its ID.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Category ID |

#### Response Body (JSON)
Same as GET `/api/v1/admin/categories` item structure.

---

### [POST] `/api/v1/admin/categories`
**Description**: Create a new product category.
**Security**: Bearer Authentication + ADMIN role required

#### Request Body (JSON)
```json
{
  "name": "string (required, max 255 characters)",
  "slug": "string (required, max 255 characters)",
  "description": "string (optional, max 1000 characters)",
  "parentId": 1,
  "sortOrder": 0,
  "isActive": true
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | Not blank, max 255 |
| slug | string | Yes | Not blank, max 255 |
| description | string | No | Max 1000 |
| parentId | long | No | - |
| sortOrder | integer | No | - |
| isActive | boolean | No | - |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Category Name",
    ...
  },
  "message": "Category created successfully"
}
```

---

### [PUT] `/api/v1/admin/categories/{id}`
**Description**: Update an existing category.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Category ID |

#### Request Body (JSON)
```json
{
  "name": "string (optional, max 255 characters)",
  "slug": "string (optional, max 255 characters)",
  "description": "string (optional, max 1000 characters)",
  "parentId": 1,
  "sortOrder": 0,
  "isActive": true
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | No | Max 255 |
| slug | string | No | Max 255 |
| description | string | No | Max 1000 |
| parentId | long | No | - |
| sortOrder | integer | No | - |
| isActive | boolean | No | - |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Name",
    ...
  },
  "message": "Category updated successfully"
}
```

---

### [DELETE] `/api/v1/admin/categories/{id}`
**Description**: Soft delete a category and all its children.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | long | Category ID |

#### Response Body (JSON)
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

### 5.3 Orders

### [GET] `/api/v1/admin/orders`
**Description**: Get all orders with pagination and optional status filter.
**Security**: Bearer Authentication + ADMIN role required

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number (0-based) |
| size | integer | No | 10 | Page size |
| status | string | No | - | Filter by status (PENDING, CONFIRMED, SHIPPED, DELIVERED, COMPLETED, CANCELLED) |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "orderCode": "ORD-20260130-ABC123",
        "userId": 1,
        "customerName": "Nguyen Van A",
        "customerEmail": "user@example.com",
        "total": 200000.00,
        "status": "PENDING",
        "shippingAddress": "123 Street, District 1, HCMC",
        "phone": "0901234567",
        "note": "Leave at front door",
        "items": [ ... ],
        "totalItems": 2,
        "createdAt": "2026-01-30T08:00:00",
        "updatedAt": "2026-01-30T08:00:00"
      }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "currentPage": 0,
    "size": 10
  }
}
```

---

### [GET] `/api/v1/admin/orders/{orderCode}`
**Description**: Get detailed information about any order by its code.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| orderCode | string | Order code |

#### Response Body (JSON)
Same as GET `/api/v1/admin/orders` item structure.

---

### [PUT] `/api/v1/admin/orders/{orderCode}/status`
**Description**: Update the status of an order.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| orderCode | string | Order code |

#### Request Body (JSON)
```json
{
  "status": "PENDING | CONFIRMED | SHIPPED | DELIVERED | COMPLETED | CANCELLED"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| status | enum | Yes | Not null |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderCode": "ORD-20260130-ABC123",
    "status": "CONFIRMED",
    ...
  },
  "message": "Order status updated to CONFIRMED"
}
```

---

### [POST] `/api/v1/admin/orders/{orderCode}/cancel`
**Description**: Cancel an order on behalf of a customer.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| orderCode | string | Order code |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderCode": "ORD-20260130-ABC123",
    "status": "CANCELLED",
    ...
  },
  "message": "Order cancelled successfully"
}
```

---

### 5.4 Payments

### [GET] `/api/v1/admin/payments`
**Description**: Get all payment transactions with pagination and optional filters.
**Security**: Bearer Authentication + ADMIN role required

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number (0-based) |
| size | integer | No | 10 | Page size |
| status | string | No | - | Filter by status (PENDING, PAID, FAILED, REFUNDED) |
| method | string | No | - | Filter by method (COD, BANK_TRANSFER) |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "orderId": 1,
        "orderCode": "ORD-20260130-ABC123",
        "method": "COD",
        "amount": 200000.00,
        "status": "PENDING",
        "transactionCode": null,
        "paidAt": null,
        "notes": null,
        "createdAt": "2026-01-30T08:00:00",
        "updatedAt": "2026-01-30T08:00:00"
      }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "currentPage": 0,
    "size": 10
  }
}
```

---

### [GET] `/api/v1/admin/payments/order/{orderCode}`
**Description**: View all payment attempts for a specific order.
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| orderCode | string | Order code |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderId": 1,
      "orderCode": "ORD-20260130-ABC123",
      "method": "COD",
      "amount": 200000.00,
      "status": "PAID",
      "transactionCode": "TXN123456",
      "paidAt": "2026-01-30T08:00:00",
      "notes": "Payment received",
      "createdAt": "2026-01-30T08:00:00",
      "updatedAt": "2026-01-30T08:00:00"
    }
  ],
  "count": 1
}
```

---

### [POST] `/api/v1/admin/payments/{orderCode}/confirm`
**Description**: Confirm that payment has been received (for COD or bank transfer).
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| orderCode | string | Order code |

#### Request Body (JSON)
```json
{
  "transactionCode": "string (optional, max 100 characters)",
  "notes": "string (optional, max 500 characters)"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| transactionCode | string | No | Max 100 |
| notes | string | No | Max 500 |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderId": 1,
    "orderCode": "ORD-20260130-ABC123",
    "status": "PAID",
    "transactionCode": "TXN123456",
    "paidAt": "2026-01-30T08:00:00",
    "notes": "Payment received",
    ...
  },
  "message": "Payment confirmed successfully"
}
```

---

### [POST] `/api/v1/admin/payments/{orderCode}/mark-failed`
**Description**: Mark a payment as failed (for retry purposes).
**Security**: Bearer Authentication + ADMIN role required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| orderCode | string | Order code |

#### Request Body (JSON)
```json
{
  "reason": "string (required, max 500 characters)"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| reason | string | Yes | Not blank, max 500 |

#### Response Body (JSON)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderId": 1,
    "orderCode": "ORD-20260130-ABC123",
    "status": "FAILED",
    ...
  },
  "message": "Payment marked as failed"
}
```

---

## Appendix: DTO Field Reference

### AuthResponse
| Field | Type | Description |
|-------|------|-------------|
| token | string | JWT token |
| email | string | User email |
| fullName | string | User full name |
| role | Role | User role (CUSTOMER, ADMIN) |

### UserResponse
| Field | Type | Description |
|-------|------|-------------|
| id | long | User ID |
| email | string | User email |
| fullName | string | User full name |
| phone | string | Phone number |
| avatarUrl | string | Avatar URL |
| role | Role | User role |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update timestamp |

### ProductDTO
| Field | Type | Description |
|-------|------|-------------|
| id | long | Product ID |
| name | string | Product name |
| slug | string | URL-friendly identifier |
| description | string | Product description |
| basePrice | decimal | Base price |
| categoryId | long | Category ID |
| categoryName | string | Category name |
| isVisible | boolean | Visibility flag |
| soldCount | long | Number of items sold |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update timestamp |
| images | array | List of ProductImageDTO |
| variants | array | List of ProductVariantDTO |

### ProductVariantDTO
| Field | Type | Description |
|-------|------|-------------|
| id | long | Variant ID |
| sku | string | Stock keeping unit |
| color | string | Color |
| size | string | Size |
| stockQuantity | integer | Available stock |
| priceAdjustment | decimal | Price adjustment from base |
| finalPrice | decimal | Calculated final price |
| isAvailable | boolean | Availability flag |
| inStock | boolean | Stock availability flag |

### ProductImageDTO
| Field | Type | Description |
|-------|------|-------------|
| id | long | Image ID |
| imageUrl | string | Image URL path |
| altText | string | Alt text for accessibility |
| sortOrder | integer | Display order |
| isPrimary | boolean | Primary image flag |

### CategoryDTO
| Field | Type | Description |
|-------|------|-------------|
| id | long | Category ID |
| name | string | Category name |
| slug | string | URL-friendly identifier |
| description | string | Category description |
| parentId | long | Parent category ID (nullable) |
| parentName | string | Parent category name |
| sortOrder | integer | Display order |
| isActive | boolean | Active flag |
| children | array | List of child CategoryDTO |

### CartDTO
| Field | Type | Description |
|-------|------|-------------|
| id | long | Cart ID |
| userId | long | User ID |
| items | array | List of CartItemDTO |
| totalItems | integer | Total item count |
| totalAmount | decimal | Total cart amount |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update timestamp |

### CartItemDTO
| Field | Type | Description |
|-------|------|-------------|
| id | long | Cart item ID |
| variantId | long | Product variant ID |
| productName | string | Product name |
| color | string | Variant color |
| size | string | Variant size |
| sku | string | Variant SKU |
| quantity | integer | Quantity in cart |
| unitPrice | decimal | Price per unit |
| subtotal | decimal | Calculated subtotal |
| imageUrl | string | Product image URL |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update timestamp |

### OrderDTO
| Field | Type | Description |
|-------|------|-------------|
| id | long | Order ID |
| orderCode | string | Unique order code |
| userId | long | User ID |
| customerName | string | Customer name |
| customerEmail | string | Customer email |
| total | decimal | Order total |
| status | OrderStatus | Order status |
| shippingAddress | string | Shipping address |
| phone | string | Contact phone |
| note | string | Customer note |
| items | array | List of OrderItemDTO |
| totalItems | integer | Total item count |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update timestamp |

### OrderItemDTO
| Field | Type | Description |
|-------|------|-------------|
| id | long | Order item ID |
| productNameSnapshot | string | Product name at order time |
| variantInfoSnapshot | string | Variant info at order time |
| quantity | integer | Quantity ordered |
| unitPrice | decimal | Price per unit at order time |
| subtotal | decimal | Calculated subtotal |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update timestamp |

### PaymentDTO
| Field | Type | Description |
|-------|------|-------------|
| id | long | Payment ID |
| orderId | long | Order ID |
| orderCode | string | Order code |
| method | PaymentMethod | Payment method |
| amount | decimal | Payment amount |
| status | PaymentStatus | Payment status |
| transactionCode | string | Transaction reference |
| paidAt | datetime | Payment timestamp |
| notes | string | Payment notes |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update timestamp |
