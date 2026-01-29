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


## 2026-01-29 (Phase: Trang Chủ FASH.ON Với Hero Slideshow)

Completed FASH.ON homepage with hero slideshow and Vietnamese UI:

**Header Component:**
- Logo FASH.ON in bold uppercase display font
- Navigation: Trang Chủ, Cửa Hàng, Danh Mục (with dropdown)
- Icons: Tìm kiếm (expandable search bar), Yêu thích, Giỏ hàng (with badge counter), User
- User dropdown when logged in (Tài Khoản, Đơn Hàng, Quản Trị, Đăng Xuất)
- Redirect to login when not authenticated
- Mobile responsive hamburger menu with full navigation

**Hero Slideshow:**
- 4 slides with bold fashion colors (black, red, orange, dark gray)
- Auto-play every 5 seconds with pause on hover
- Left/right navigation arrows with smooth transitions
- Dot indicators and slide counter (01/04 format)
- Vietnamese headlines and CTAs (Mua Sắm Ngay, Xem Ngay, Khám Phá)

**Danh Mục Nổi Bật:**
- Grid of 4-5 categories from API categories tree
- Each card with dynamic background colors and hover effects
- Loading skeleton for better UX
- Vietnamese text with "Khám Phá Ngay" hover text

**Sản Phẩm Bán Chạy:**
- Grid products from API top-selling endpoint
- ProductCard with image, category, name, price (VND format)
- Discount badges (red) and New badges (black)
- Hover actions: Thêm Giỏ, Xem Nhanh, Yêu Thích
- Loading skeletons
- Navigation to /san-pham/[slug] on click

**Banner Dịch Vụ:**
- 3 columns: Giao Hàng Nhanh (Truck icon), Chính Hãng 100% (ShieldCheck icon), Hỗ Trợ 24/7 (Headphones icon)
- Lucide icons only, no emojis
- Dark background with hover effects

**Footer:**
- Newsletter subscription with Sonner toast
- Contact info: email, phone, address
- Links: Cửa Hàng, Hỗ Trợ, Công Ty
- Social links: Facebook, Instagram, Youtube
- Copyright notice

**Technical Stack:**
- Next.js 16.1.6 with App Router
- React Query for data fetching with loading states
- Tailwind CSS for styling
- Lucide React for icons
- Sonner for toast notifications
- Be Vietnam Pro + Playfair Display fonts (Vietnamese support)
- 100% Vietnamese text throughout UI (Trang Chủ, Cửa Hàng, Giỏ Hàng, Tìm Kiếm, etc.)

**Files Created/Updated (Refactored Structure):**
- frontend/src/components/layout/Header.tsx
- frontend/src/components/layout/Footer.tsx
- frontend/src/components/home/HeroSlideshow.tsx
- frontend/src/components/home/CategoryGrid.tsx
- frontend/src/components/home/BestSellersGrid.tsx
- frontend/src/components/home/ProductCard.tsx
- frontend/src/components/home/ServiceBanner.tsx
- frontend/src/components/ui/button.tsx
- frontend/src/components/ui/skeleton.tsx
- frontend/src/components/ui/badge.tsx
- frontend/src/components/providers/QueryProvider.tsx
- frontend/src/lib/api.ts
- frontend/src/lib/hooks/use-products.ts
- frontend/src/lib/hooks/use-cart.ts (Zustand store)
- frontend/src/types/index.ts
- frontend/src/app/san-pham/[slug]/page.tsx (placeholder)
- frontend/src/app/globals.css (FASH.ON theme)
- frontend/src/app/layout.tsx (QueryProvider, Sonner, Vietnamese lang)
- frontend/src/app/page.tsx (Homepage assembly)
- frontend/next.config.ts (external images)

Commit: "feat: FASH.ON home page with hero slideshow and vietnamese ui"