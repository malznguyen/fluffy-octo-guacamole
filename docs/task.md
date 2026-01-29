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

