# Fash.On - E-commerce Fashion Platform

## Project Overview

Fash.On is a full-stack e-commerce platform specializing in fashion retail. The project follows a modern layered architecture with a Next.js frontend and Spring Boot backend.

**Primary Language**: Vietnamese (Tiếng Việt) - all user-facing content, comments, and documentation use Vietnamese.

**Project Structure**:
```
fluffy-octo-guacamole/
├── backend/          # Spring Boot Java backend
├── frontend/         # Next.js React frontend
├── database/         # SQL Server scripts
└── docs/             # API documentation
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui components (style: new-york)
- **State Management**: 
  - Zustand (global state with persistence)
  - React Hook Form (form state)
  - TanStack Query (server state)
- **HTTP Client**: Axios
- **Validation**: Zod
- **Notifications**: Sonner (toast)
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 21
- **Persistence**: Spring Data JPA + Hibernate
- **Database**: SQL Server 2022
- **Security**: Spring Security + JWT (jjwt 0.12.3)
- **Password Encoding**: BCrypt
- **API Documentation**: SpringDoc OpenAPI 2.3.0 (Swagger)
- **Migration**: Flyway (currently disabled)
- **Build Tool**: Maven

### Database
- **Engine**: SQL Server 2022
- **Collation**: Vietnamese_100_CI_AS_SC_UTF8
- **Migration**: Flyway (disabled in application.yml)

---

## Project Architecture

### Backend Package Structure (Layered Architecture)

```
com.fashon/
├── FashOnApplication.java     # Spring Boot entry point
├── domain/                    # Core business entities
│   ├── entity/               # JPA entities (Product, User, Order, etc.)
│   ├── enums/                # Enums (Role, OrderStatus, PaymentMethod, PaymentStatus)
│   └── BaseEntity.java       # Base entity with audit fields (createdAt, updatedAt, deletedAt)
├── application/               # Application layer
│   ├── dto/                  # Data Transfer Objects (Request/Response)
│   └── service/              # Business logic services
├── infrastructure/            # Infrastructure layer
│   ├── config/               # Configuration classes (Security, JWT, OpenAPI, Audit, Static Resources)
│   ├── converter/            # JPA AttributeConverters (RoleConverter, OrderStatusConverter)
│   ├── repository/           # Spring Data JPA repositories
│   └── security/             # JWT authentication (JwtUtil, JwtAuthenticationFilter)
└── interfaces/rest/          # REST API controllers
    ├── AuthController.java
    ├── CartController.java
    ├── OrderController.java
    ├── PaymentController.java
    ├── PublicProductController.java
    ├── UserController.java
    ├── WishlistController.java
    ├── ReviewController.java
    ├── AdminCategoryController.java
    ├── AdminOrderController.java
    ├── AdminPaymentController.java
    ├── AdminProductController.java
    ├── AdminUserController.java
    └── GlobalExceptionHandler.java
```

### Frontend Directory Structure

```
frontend/src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Route group for authentication pages
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (shop)/              # Route group for shop pages
│   │   ├── page.tsx         # Homepage
│   │   ├── layout.tsx       # Shop layout with Header/Footer
│   │   ├── loading.tsx      # Loading UI
│   │   ├── products/        # Product listing & details
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── guide/           # Shopping guide
│   │   ├── shipping/        # Shipping policy
│   │   ├── return-policy/   # Return policy
│   │   ├── careers/         # Careers page
│   │   └── wishlist/        # Wishlist page
│   ├── admin/               # Admin dashboard pages
│   │   ├── page.tsx         # Admin dashboard
│   │   ├── categories/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── payments/page.tsx
│   │   ├── products/page.tsx
│   │   └── users/page.tsx
│   ├── cart/page.tsx        # Shopping cart
│   ├── checkout/            # Checkout flow
│   │   ├── page.tsx
│   │   └── success/page.tsx
│   ├── dashboard/page.tsx   # User dashboard
│   ├── orders/              # Order history
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles (Tailwind v4)
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── products/
│   │   └── users/
│   ├── home/               # Homepage components (HeroSlider, CategoryCard)
│   ├── layout/             # Layout components (Header, Footer)
│   ├── product/            # Product-related components (ProductCard, ProductFilters)
│   │   └── reviews/        # Review components
│   ├── providers/          # Context providers (ClientProvider)
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
│   ├── use-admin-orders.ts
│   ├── use-admin-users.ts
│   ├── use-categories.ts
│   └── use-products.ts
├── lib/                    # Utilities and API clients
│   ├── api/                # API functions organized by feature
│   │   ├── admin/          # Admin API functions
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   ├── client.ts
│   │   ├── order.ts
│   │   ├── public.ts
│   │   ├── reviews.ts
│   │   └── wishlist.ts
│   ├── api.ts              # Legacy API functions
│   ├── axios.ts            # Axios instance configuration
│   └── utils.ts            # Utility functions (cn helper)
├── stores/                 # Zustand stores
│   ├── auth-store.ts       # Authentication state
│   ├── cart-store.ts       # Cart state
│   └── wishlist-store.ts   # Wishlist state
├── types/                  # TypeScript type definitions
│   ├── auth.ts
│   ├── cart.ts
│   ├── category.ts
│   ├── enums.ts
│   ├── order.ts
│   ├── product.ts
│   ├── review.ts
│   └── user.ts
├── utils/                  # Utility functions
│   └── tree-utils.ts       # Tree data structure utilities
└── middleware.ts           # Next.js middleware for auth protection
```

---

## Configuration Files

### Backend (`backend/src/main/resources/application.yml`)

```yaml
# Database Configuration
spring.datasource.url: jdbc:sqlserver://localhost:1433;databaseName=fashon_db;encrypt=true;trustServerCertificate=true
spring.datasource.username: sa
spring.datasource.password: "123456"

# JPA Configuration
spring.jpa.hibernate.ddl-auto: none
spring.jpa.show-sql: true
spring.jpa.properties.hibernate.dialect: org.hibernate.dialect.SQLServerDialect

# Flyway (disabled)
spring.flyway.enabled: false

# File Upload
spring.servlet.multipart.max-file-size: 25MB
spring.servlet.multipart.max-request-size: 50MB

# JWT Configuration
jwt.secret: ${JWT_SECRET:fashon-super-secret-key-that-should-be-very-long-for-security}
jwt.expiration: ${JWT_EXPIRATION:86400000}  # 24 hours

# Server
server.port: 8080

# API Docs
springdoc.swagger-ui.path: /swagger-ui.html

# Upload Directory
app.upload.dir: backend/uploads
```

### Frontend (`frontend/next.config.ts`)

```typescript
// Key configurations:
// - API proxy: /api/spring/* → http://localhost:8080/api/v1/*
// - Uploads proxy: /uploads/* → http://localhost:8080/uploads/*
// - Remote images: images.unsplash.com and localhost:8080 allowed
```

### Frontend (`frontend/components.json`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide"
}
```

---

## Build and Development Commands

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Backend

```bash
cd backend

# Compile and run tests
mvn clean test

# Run development server (port 8080)
mvn spring-boot:run

# Build JAR
mvn clean package

# Run JAR
java -jar target/fashon-backend-1.0.0.jar
```

### Database

```bash
# Execute initialization script
sqlcmd -S localhost -U sa -P "123456" -i database/01_init_database.sql

# Execute seed data
sqlcmd -S localhost -U sa -P "123456" -i database/02_seed_data.sql
```

---

## API Structure

**Base URL**: `http://localhost:8080/api/v1`

### Endpoint Categories

| Category | Path Pattern | Auth Required |
|----------|--------------|---------------|
| Authentication | `/api/v1/auth/**` | No |
| Public Products | `/api/v1/public/**` | No |
| User Operations | `/api/v1/users/**`, `/api/v1/cart/**`, `/api/v1/orders/**`, `/api/v1/wishlist/**`, `/api/v1/reviews/**` | Yes (JWT) |
| Admin Operations | `/api/v1/admin/**` | Yes (ADMIN role) |

### Key API Endpoints

**Authentication**:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

**Public Products**:
- `GET /api/v1/public/products` - List products with filters (pagination)
- `GET /api/v1/public/products/{slug}` - Get product details
- `GET /api/v1/public/products/newest?limit={n}` - Get newest products
- `GET /api/v1/public/products/top-selling?limit={n}` - Get top selling products
- `GET /api/v1/public/categories` - List categories
- `GET /api/v1/public/categories/tree` - Get category tree structure

**Cart**:
- `GET /api/v1/cart` - View cart
- `POST /api/v1/cart/items` - Add to cart
- `PUT /api/v1/cart/items/{id}` - Update cart item quantity
- `DELETE /api/v1/cart/items/{id}` - Remove cart item

**Orders**:
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List user orders (pagination)
- `GET /api/v1/orders/{orderCode}` - Get order details
- `POST /api/v1/orders/{orderCode}/cancel` - Cancel order

**Reviews**:
- `GET /api/v1/public/products/{slug}/reviews` - Get product reviews
- `POST /api/v1/products/{productId}/reviews` - Add review (verified purchase required)
- `PUT /api/v1/reviews/{reviewId}` - Update own review
- `DELETE /api/v1/reviews/{reviewId}` - Delete own review

**Wishlist**:
- `GET /api/v1/wishlist` - Get user's wishlist
- `POST /api/v1/wishlist` - Add product to wishlist
- `DELETE /api/v1/wishlist/{productId}` - Remove from wishlist

**Admin**:
- `GET /api/v1/admin/products` - List all products (admin)
- `POST /api/v1/admin/products` - Create product
- `PUT /api/v1/admin/products/{id}` - Update product
- `DELETE /api/v1/admin/products/{id}` - Delete product
- `GET /api/v1/admin/orders` - Manage orders
- `PUT /api/v1/admin/orders/{code}/status` - Update order status
- `GET /api/v1/admin/users` - List all users
- `PUT /api/v1/admin/users/{id}` - Update user
- `DELETE /api/v1/admin/users/{id}` - Soft delete user

### API Documentation

Interactive API docs available at: `http://localhost:8080/swagger-ui.html`

Full API reference: `docs/endpoint_api.md`

---

## Code Style Guidelines

### Java (Backend)

- **Package naming**: lowercase, reverse domain (`com.fashon`)
- **Class naming**: PascalCase
- **Method/Variable naming**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Lombok**: Use `@RequiredArgsConstructor`, `@Getter`, `@Setter` annotations
- **Entity IDs**: Use `Long` type
- **Soft Delete**: All entities extend `BaseEntity` with `deletedAt` field
- **Comments**: Use Vietnamese for business logic explanations

Example:
```java
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    
    // Lấy danh sách sản phẩm mới nhất
    public List<ProductDTO> getNewestProducts(int limit) {
        return productRepository.findTopNByIsVisibleTrueOrderByCreatedAtDesc(limit);
    }
}
```

### TypeScript (Frontend)

- **Component naming**: PascalCase
- **Function naming**: camelCase
- **Type/Interface naming**: PascalCase
- **File naming**: camelCase for utilities, PascalCase for components
- **Path aliases**: Use `@/` prefix (configured in tsconfig.json)
- **Comments**: Use Vietnamese for business logic

Example:
```typescript
// Lấy danh sách sản phẩm mới nhất
export async function fetchNewestProducts(limit: number = 4): Promise<ProductDTO[]> {
  const response = await apiClient.get<ApiResponse<ProductDTO[]>>(
    `/public/products/newest?limit=${limit}`
  );
  return response.data.data;
}
```

---

## Testing Strategy

### Backend Testing
- Unit tests: `src/test/java` (JUnit 5 + Mockito) - **Not currently implemented**
- Run tests: `mvn test`
- Integration tests use `@SpringBootTest`

### Frontend Testing
- No test framework currently configured
- ESLint for code quality: `npm run lint`

---

## Security Considerations

### Authentication
- JWT-based stateless authentication
- Token expiration: 24 hours (configurable via `JWT_EXPIRATION`)
- Token secret should be changed in production (`JWT_SECRET`)
- Frontend stores token in both Zustand store and cookie (`fashon-token`)

### Authorization
- Roles: `CUSTOMER`, `ADMIN`
- Admin endpoints require `ADMIN` role (`@PreAuthorize("hasRole('ADMIN')")`)
- Method-level security via `@PreAuthorize`

### CORS
- Configured for `http://localhost:3000` (frontend)
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials allowed

### Password Security
- BCrypt password encoder (strength 10)
- Passwords hashed before storage
- Default password for test accounts: `123456`

### File Upload Security
- Max file size: 25MB per file, 50MB per request
- Allowed types: Images only (server-side validation)
- Upload directory: `backend/uploads/`

### Middleware Protection (Frontend)
Protected routes: `/dashboard`, `/cart`, `/checkout`, `/orders`, `/profile`, `/admin`
Auth routes (redirect if logged in): `/login`, `/register`

---

## Database Schema

### Key Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts (customers & admins) |
| `categories` | Product categories (self-referencing) |
| `products` | Product information |
| `product_variants` | Product variants (color, size, SKU) |
| `product_images` | Product images |
| `carts` | Shopping carts (1-1 with users) |
| `cart_items` | Cart items |
| `orders` | Customer orders |
| `order_items` | Order line items |
| `payments` | Payment records |
| `product_reviews` | Product reviews |
| `wishlists` | User wishlists |
| `coupons` | Discount coupons |
| `inventory_transactions` | Stock movement tracking |

### Soft Delete Pattern
All tables have `deleted_at` column. Records are soft-deleted by setting this timestamp instead of physical deletion.

### Enums

**Role**: `CUSTOMER`, `ADMIN`

**OrderStatus**: 
- `PENDING` - Chờ xác nhận
- `CONFIRMED` - Đã xác nhận
- `SHIPPED` - Đang giao
- `DELIVERED` - Đã giao
- `COMPLETED` - Hoàn thành
- `CANCELLED` - Hủy

**PaymentMethod**: `COD`, `BANK_TRANSFER`

**PaymentStatus**: `PENDING`, `PAID`, `FAILED`, `REFUNDED`

---

## Development Environment Setup

### Prerequisites
- Java 21 JDK
- Maven 3.8+
- Node.js 20+
- SQL Server 2022

### Setup Steps

1. **Database**:
   ```bash
   sqlcmd -S localhost -U sa -P "your_password" -i database/01_init_database.sql
   sqlcmd -S localhost -U sa -P "your_password" -i database/02_seed_data.sql
   ```

2. **Backend**:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html

### Default Test Accounts
- Admin: `admin@fashon.vn` / password: `123456`
- Customer: `nguyenvana@gmail.com` / password: `123456`
- Customer: `tranthib@gmail.com` / password: `123456`
- Customer: `lethic@gmail.com` / password: `123456`
- Customer: `phamvand@gmail.com` / password: `123456`

---

## Deployment Notes

### Backend Deployment
1. Build JAR: `mvn clean package`
2. Set environment variables:
   - `JWT_SECRET` - Secure random string
   - `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
3. Run: `java -jar target/fashon-backend-1.0.0.jar`

### Frontend Deployment
1. Build: `npm run build`
2. Configure environment variables in `.env.local`:
   - `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
3. Deploy output directory: `.next/`

### Production Considerations
- Change default JWT secret
- Use HTTPS for API communications
- Configure proper CORS origins
- Set up database backups
- Configure file upload storage (S3/Cloud Storage recommended)
- Enable Flyway for database migrations if needed

---

## Common Issues

### CORS Errors
Ensure backend CORS configuration includes frontend origin:
```java
config.setAllowedOrigins(List.of("http://localhost:3000"));
```

### Database Connection
Verify SQL Server is running and credentials in `application.yml` are correct.

### File Uploads Not Working
Check that `backend/uploads/` directory exists and is writable.

---

## Useful Resources

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
