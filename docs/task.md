# Task Log

## 2026-01-29

Created database schema with 13 tables including reviews, wishlists, coupons, inventory tracking. Followed soft delete, BigDecimal(19,4), NVARCHAR constraints.

Scaffolded Spring Boot 3.2 backend with JPA soft delete base entity and Next.js 15 frontend with App Router and Shadcn UI. Ready for feature development.

## 2026-01-29 (Phase 2: User & Auth)

Completed User & Auth module:
- User entity with soft delete, audit timestamps, NVARCHAR fields
- Role enum (CUSTOMER, ADMIN)
- JWT Authentication with BCrypt password encoding
- Auth endpoints: POST /api/v1/auth/register, POST /api/v1/auth/login
- User endpoints: GET /api/v1/users/me, PUT /api/v1/users/me, DELETE /api/v1/users/me (soft delete)
- Swagger OpenAPI with Bearer token support at /swagger-ui.html

Note: Backend requires SQL Server running locally with Windows Authentication. Run database/03_create_users_table.sql in SSMS before testing.

## 2026-01-29 (Phase 3: Product Catalog)

Completed Product Catalog module:
- Category entity with tree structure (parent-child), soft delete recursive
- Product entity with BigDecimal(19,4) basePrice, slug, visibility status
- ProductVariant entity with unique SKU, stock quantity, price adjustment
- ProductImage entity with sort order, primary flag, file path storage
- Repositories with custom queries for filtering, searching, pagination
- CategoryService with recursive soft delete for parent-child hierarchy
- ProductService with variant/image handling, price calculation
- FileStorageService for image uploads (5MB limit, jpg/png/gif/webp only)
- Admin controllers (ADMIN role required):
  - POST/PUT/DELETE /api/v1/admin/categories - Category CRUD
  - GET /api/v1/admin/categories/tree - Hierarchical category tree
  - POST/PUT/DELETE /api/v1/admin/products - Product CRUD
  - POST /api/v1/admin/products/{id}/variants - Add variant
  - POST /api/v1/admin/products/{id}/images - Add image
  - POST /api/v1/admin/products/upload-image - File upload
- Public controllers (no auth required):
  - GET /api/v1/public/products - List with pagination, filter by category/price, search, sort
  - GET /api/v1/public/products/{slug} - Product detail with variants/images
  - GET /api/v1/public/categories - Active categories list
  - GET /api/v1/public/categories/tree - Category tree for menu
  - GET /api/v1/public/products/top-selling - Top selling products
  - GET /api/v1/public/products/newest - Newest products
- Swagger/OpenAPI documentation with Admin and Public tags
- Database migration: database/04_create_product_tables.sql

Note: Run database/04_create_product_tables.sql in SSMS before testing. Uploads stored in backend/uploads/ folder.

## 2026-01-29 (Phase 4: Order & Inventory Management)

Completed Order & Inventory Management module:

### Cart System
- Cart entity (1-1 relationship with User) with soft delete support
- CartItem entity linking to ProductVariant with quantity tracking
- CartService with stock validation before adding to cart
- APIs:
  - GET /api/v1/cart - View current user's cart
  - POST /api/v1/cart/items - Add product variant to cart (with stock check)
  - PUT /api/v1/cart/items/{id} - Update item quantity (validates stock)
  - DELETE /api/v1/cart/items/{id} - Remove item from cart

### Order System
- Order entity with BigDecimal(19,4) total, order code (ORD + timestamp + random)
- OrderItem entity with snapshot data (product name, variant info, unit price at purchase time)
- OrderStatus enum: PENDING -> CONFIRMED -> SHIPPED -> DELIVERED -> COMPLETED, plus CANCELLED
- Status transition validation (e.g., cannot cancel shipped orders)
- Soft delete for Order and OrderItem (audit trail compliance)
- OrderService with create from cart, status management, cancellation
- Customer APIs:
  - POST /api/v1/orders - Create order from cart (deducts stock, clears cart)
  - GET /api/v1/orders - Order history with pagination
  - GET /api/v1/orders/{orderCode} - Order details with items
  - POST /api/v1/orders/{orderCode}/cancel - Cancel order (if PENDING/CONFIRMED)
- Admin APIs:
  - GET /api/v1/admin/orders - All orders with pagination and status filter
  - GET /api/v1/admin/orders/{orderCode} - Any order details
  - PUT /api/v1/admin/orders/{orderCode}/status - Update order status
  - POST /api/v1/admin/orders/{orderCode}/cancel - Admin cancel order

### Inventory Management
- InventoryTransaction entity tracking all stock changes (positive/negative)
- Automatic stock deduction on order creation
- Stock validation before adding to cart or creating order (prevents negative inventory)
- InventoryService with methods for:
  - deductStockForOrder() - Log order-based stock deduction
  - returnStockForCancelledOrder() - Return stock on cancellation
  - addStock() / deductStock() - Manual inventory adjustments
  - hasEnoughStock() / getCurrentStock() - Stock queries

### Security
- All cart/order endpoints require JWT authentication
- Customer endpoints only access own data
- Admin endpoints require ADMIN role
- Cart items verified to belong to user's cart before modification

### Golden Rules Compliance
- BigDecimal(19,4) for all currency values (total, unitPrice)
- Soft delete on all entities (deleted_at column)
- NVARCHAR for all text fields (shipping address, phone, notes)
- Proper transaction handling for order creation and inventory updates

Note: Database tables already exist from 01_init_database.sql. Test flow: Add to cart -> Create order -> Admin updates status -> Cancel order.

## 2026-01-29 (Phase 5: Simple Payment Tracking)

Phase 5: Simple payment tracking with COD and bank transfer confirmation (no third-party gateway integration).

### Payment Entity
- Payment entity linked to Order (1 order can have multiple payment attempts + 1 successful)
- Fields: method (COD, BANK_TRANSFER), amount (BigDecimal 19,4), status (PENDING, PAID, FAILED, REFUNDED)
- transactionCode (simulated or NULL for COD), paidAt timestamp, notes (NVARCHAR)
- Soft delete support for cleaning up error history
- PaymentMethod enum: COD, BANK_TRANSFER
- PaymentStatus enum: PENDING, PAID, FAILED, REFUNDED

### Business Logic
- When creating order (PENDING), auto-create Payment with status PENDING
- COD: Admin confirms payment after delivery (marks as PAID)
- BANK_TRANSFER: Admin confirms received transfer via API (marks as PAID)
- For non-COD payments, order auto-confirms when payment is marked PAID

### APIs
Customer endpoints:
- GET /api/v1/orders/{orderCode}/payments - View payment history for order

Admin endpoints:
- GET /api/v1/admin/payments - All payments (pagination, filter by status/method)
- GET /api/v1/admin/payments/order/{orderCode} - Payments for specific order
- POST /api/v1/admin/payments/{orderCode}/confirm - Confirm payment received
- POST /api/v1/admin/payments/{orderCode}/mark-failed - Mark payment as failed

### Integration
- CreateOrderRequest now requires paymentMethod field
- OrderService auto-creates Payment when order is created
- PaymentService handles confirmation logic and auto-order-confirmation for bank transfers

### Database
- Added payments table to 01_init_database.sql
- 14 total tables now

Constraints followed:
- BigDecimal(19,4) for amount
- NVARCHAR for transaction_code and notes
- Soft delete on Payment entity
- No third-party gateway integration (VNPay/Momo) - simplified for school project

## 2026-01-29 (Phase 6.1: Customer Frontend Desktop UI)

Phase 6.1: Completed customer frontend pages (Home, Shop, Product, Cart, Checkout, Orders) with 100% Vietnamese UI, Be Vietnam Pro font, Lucide icons, no mobile yet.

### Setup & Configuration
- Installed dependencies: @tanstack/react-query, react-hook-form, zod, sonner, @hookform/resolvers, next-themes
- Installed shadcn components: button, card, input, select, badge, separator, skeleton, dialog, table, form, sonner, radio-group, label, textarea, scroll-area, sheet
- Configured Be Vietnam Pro font (Google Fonts) with Vietnamese subset support
- Created QueryProvider for TanStack Query with default staleTime and error handling
- Created ToastProvider with Sonner for notifications (no alert()/confirm())
- Created AuthContext for authentication state management
- Created types for API: Product, Category, Cart, Order, User, PaymentMethod, OrderStatus

### API Hooks (TanStack Query)
- useProducts, useProduct, useTopSellingProducts - Product fetching with filters
- useCategories, useCategoryTree - Category fetching
- useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem - Cart operations
- useOrders, useOrder, useCreateOrder, useCancelOrder - Order operations

### Components
- Header: Navigation with cart badge, user info, mobile menu
- Footer: Brand info, quick links, customer service, contact details

### Pages Implemented

#### Home Page (/)
- Hero section: "Thờ Trang Củ Bạn - Phong Cách Không Giới Hạn"
- Best Sellers section with product grid (4-5 columns)
- Featured Categories section
- Features: Free shipping, Easy returns, 24/7 support
- Vietnamese UI throughout

#### Shop Page (/shop)
- Wide layout with 4-5 column product grid
- Filter sidebar: Category selection, Price range (min/max)
- Sort dropdown: Mới nhất, Giá tăng dần, Giá giảm dần, Bán chạy
- Quick View dialog with variant selection and add to cart
- Pagination support

#### Product Detail Page (/product/[slug])
- Two-column layout: Image gallery + Product info
- Variant selection (size, color) with price adjustments
- Quantity selector with +/- buttons
- Large "Thêm Vào Giỏ Hàng" button with ShoppingCart icon
- Star rating display (Lucide icons)
- Reviews section with Vietnamese comments
- Back to shop navigation

#### Cart Page (/cart)
- Wide table with: Image, Product name (with size/color), Unit price, Quantity, Subtotal, Remove button
- Quantity adjustment with +/- buttons
- Remove item with Trash2 icon
- Order summary card with total amount
- "Tiến Hành Thanh Toán" button linking to checkout
- Empty cart state with call-to-action

#### Checkout Page (/checkout)
- Form with React Hook Form + Zod validation
- Shipping info: Họ và tên, Số điện thoại, Địa chỉ, Ghi chú
- Payment method: COD (Thanh toán khi nhận hàng) or Bank Transfer
- Order summary sidebar with item list and totals
- "Đặt Hàng" button with validation
- Toast notification on success/error

#### Orders Page (/orders)
- Table view: Order code, Date, Total, Status, Actions
- Status badges with colors:
  - Chờ xác nhận (yellow)
  - Đã xác nhận (blue)
  - Đang giao (purple)
  - Hoàn thành (green)
  - Đã hủy (red)
- Order detail dialog with full information
- Cancel order button (for PENDING orders only)
- Empty state with CTA

### Design Compliance
- 100% Vietnamese UI (no English text in user-facing elements)
- Be Vietnam Pro font for all text
- Lucide React icons only (ShoppingCart, Trash2, Eye, Star, Truck, CreditCard, etc.)
- No emojis in UI
- Skeleton loading states
- Toast notifications (Sonner)
- Form validation with Vietnamese error messages

### Phase 6.1 Update (Fix schema + wire frontend)
- Disabled Hibernate schema auto-management (ddl-auto: none) to prevent SQL Server DDL conflicts.
- Added CORS allowance for http://localhost:3000 in SecurityConfig.
- Wired frontend API hooks to public endpoints and response wrapper format.
- Updated Home/Shop/Product/Cart/Checkout/Orders pages to align with backend DTOs (orderCode, unitPrice, imageUrl, variantInfoSnapshot).

### Technical Stack
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- TanStack Query for data fetching
- React Hook Form + Zod for form validation
- Axios with JWT interceptor

Note: Desktop-only implementation. Mobile responsive design is Phase 6.2.

