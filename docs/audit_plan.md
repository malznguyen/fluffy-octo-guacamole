# Fash.On Final Audit Report
**Date**: 2026-01-31
**Scope**: Đồ án kết thúc môn - Fullstack E-commerce

## Executive Summary
- **Tổng issues theo severity**: 
  - **CRITICAL**: 0 (Không tìm thấy lỗi bảo mật nghiêm trọng hay crash app)
  - **HIGH**: 6 (User Soft Delete, Thiếu Wishlist, Reviews, Search, Profile, Checkout logic)
  - **MEDIUM**: 3 (N+1 Query, Missing Skeleton, Scatter API def, Code duplication)
  - **LOW**: Many (TypeScript `any`, UI inconsistencies)
- **Tính năng còn thiếu Must Have**: 
  1. Wishlist (Yêu thích)
  2. Product Reviews (Đánh giá sản phẩm)
  3. Search (Tìm kiếm nâng cao)
  4. User Profile (Đổi mật khẩu, Avatar)
- **Khuyến nghị ưu tiên**: 
  1. Fix lỗi logic Backend (User Soft Delete).
  2. Implement tính năng Wishlist & Reviews (tăng tương tác).
  3. Hoàn thiện Search & Profile.
  4. Polish UI & Refactor Code.

## Part 1: Backend Issues

### HIGH
- **[B-HIGH-001]** Tenant Isolation / Soft Delete Failed for Users | Location: `com.fashon.domain.entity.User.java`
  - **Mô tả**: Entity `User` extend `BaseEntity` nhưng thiếu annotation `@Where(clause = "deleted_at IS NULL")`.
  - **Ảnh hưởng**: User đã xóa (soft delete) vẫn đăng nhập được hoặc xuất hiện trong list admin.
  - **Fix**: Thêm `@Where(clause = "deleted_at IS NULL")` vào class `User`.

### MEDIUM
- **[B-MED-001]** N+1 Query Problem in Order List | Location: `OrderService.java` method `getAllOrders`
  - **Mô tả**: `getAllOrders` gọi `orderRepository.findAll(pageable)` trả về Page<Order>. Sau đó `mapToOrderDTO` gọi `order.getItems()` (Lazy fetch).
  - **Ảnh hưởng**: Nếu trang có 10 order, sẽ bắn thêm 10 query để lấy items. Database chịu tải cao.
  - **Fix**: Sử dụng `orderRepository.findAllWithItems(pageable)` (custom query dùng `LEFT JOIN FETCH`).

## Part 2: Frontend - Code & Bug Issues

### MEDIUM
- **[F-MED-001]** Missing UI Component: Skeleton | Location: `frontend/src/components/ui/skeleton.tsx`
  - **Mô tả**: File `skeleton.tsx` không tồn tại trong `components/ui`.
  - **Ảnh hưởng**: Loading state không đẹp (hoặc dùng text "Loading..." đơn điệu).
  - **Fix**: Implement `Skeleton` component từ shadcn/ui.

- **[F-MED-002]** Type Safety Violations | Location: Multiple files (`use-categories.ts`, `select.tsx`)
  - **Mô tả**: Sử dụng `any` rải rác.
  - **Fix**: Defines proper interfaces/types.

### LOW
- **[F-LOW-001]** API Definition Scattering
  - **Mô tả**: `lib/api.ts` chỉ chứa public endpoints. Auth/Cart API gọi trực tiếp trong Store/Page.
  - **Fix**: Centralize toàn bộ API call về `lib/api` hoặc structure rõ ràng hơn (`lib/api/auth.ts`, `lib/api/cart.ts`).

## Part 3: Missing Features (Must Have)
- **[FEAT-001]** Thiếu trang Wishlist | Priority: **HIGH**
  - **Backend**: Thiếu `WishlistController`, `WishlistService`, `WishlistRepository`.
  - **Frontend**: Thiếu `src/app/(shop)/wishlist/page.tsx`, `WishlistStore`.
  - **Ảnh hưởng**: User không lưu được sản phẩm yêu thích.

- **[FEAT-002]** Thiếu Product Reviews | Priority: **HIGH**
  - **Backend**: Thiếu `ReviewController`, `ReviewService`.
  - **Frontend**: Thiếu UI hiển thị Review ở trang Product Detail, Form submit Review.
  - **Ảnh hưởng**: Giảm độ tin cậy sản phẩm.

- **[FEAT-003]** Search Bar chưa functional | Priority: **HIGH**
  - **Frontend**: Header Search Bar chưa hoạt động. Chưa có trang kết quả `/search`.
  - **Backend**: Đã có `PublicProductController.getProducts` support filter, cần tích hợp.


----- ĐÃ XONG --------
