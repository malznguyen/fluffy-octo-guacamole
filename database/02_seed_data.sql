-- =============================================
-- FASH.ON - SEED DATA
-- Created: 2026-01-31
-- Tech: SQL Server 2022
-- Password default: 123456 (BCrypt hashed)
-- =============================================

USE fashon_db;
GO

-- =============================================
-- 1. USERS (1 Admin + 4 Customers)
-- =============================================
SET IDENTITY_INSERT users ON;
GO

INSERT INTO users (id, email, password_hash, full_name, phone, role, created_at, updated_at, deleted_at)
VALUES 
    (1, N'admin@fashon.vn', '$2a$12$6VdSuSo8boHhxOZqvxHmIeeqkwBug0Xh73m5HJKm0fqda4cJvXInK', N'Quản Trị Viên', N'0909123456', N'ADMIN', GETDATE(), GETDATE(), NULL),
    (2, N'nguyenvana@gmail.com', '$2a$12$6VdSuSo8boHhxOZqvxHmIeeqkwBug0Xh73m5HJKm0fqda4cJvXInK', N'Nguyễn Văn A', N'0912345678', N'CUSTOMER', GETDATE(), GETDATE(), NULL),
    (3, N'tranthib@gmail.com', '$2a$12$6VdSuSo8boHhxOZqvxHmIeeqkwBug0Xh73m5HJKm0fqda4cJvXInK', N'Trần Thị B', N'0987654321', N'CUSTOMER', GETDATE(), GETDATE(), NULL),
    (4, N'lethic@gmail.com', '$2a$12$6VdSuSo8boHhxOZqvxHmIeeqkwBug0Xh73m5HJKm0fqda4cJvXInK', N'Lê Thị C', N'0909123457', N'CUSTOMER', GETDATE(), GETDATE(), NULL),
    (5, N'phamvand@gmail.com', '$2a$12$6VdSuSo8boHhxOZqvxHmIeeqkwBug0Xh73m5HJKm0fqda4cJvXInK', N'Phạm Văn D', N'0911223344', N'CUSTOMER', DATEADD(day, -2, GETDATE()), DATEADD(day, -2, GETDATE()), NULL);
GO

SET IDENTITY_INSERT users OFF;
GO

-- =============================================
-- 2. CATEGORIES (3 danh mục cha, không có con)
-- =============================================
SET IDENTITY_INSERT categories ON;
GO

INSERT INTO categories (id, name, slug, description, parent_id, sort_order, is_active, created_at, updated_at, deleted_at)
VALUES 
    (1, N'ThờI trang nam', N'thoi-trang-nam', N'Bộ sưu tập thờI trang nam đa dạng phong cách', NULL, 0, 1, GETDATE(), GETDATE(), NULL),
    (2, N'ThờI trang nữ', N'thoi-trang-nu', N'Bộ sưu tập thờI trang nữ thanh lịch và hiện đại', NULL, 1, 1, GETDATE(), GETDATE(), NULL),
    (3, N'Phụ kiện', N'phu-kien', N'Các loại phụ kiện thờI trang độc đáo', NULL, 2, 1, GETDATE(), GETDATE(), NULL);
GO

SET IDENTITY_INSERT categories OFF;
GO

-- =============================================
-- 3. PRODUCTS (12 sản phẩm - 4 mỗi danh mục)
-- =============================================
SET IDENTITY_INSERT products ON;
GO

INSERT INTO products (id, name, slug, description, base_price, category_id, is_visible, sold_count, created_at, updated_at, deleted_at)
VALUES 
    -- ThờI trang nam (category_id = 1)
    (1, N'Áo thun nam cổ tròn basic', N'ao-thun-nam-co-tron-basic', N'Áo thun nam chất liệu cotton 100%, thoáng mát, thấm hút mồ hôi tốt. Form regular fit phù hợp mọi vóc dáng.', 199000, 1, 1, 45, DATEADD(day, -30, GETDATE()), DATEADD(day, -30, GETDATE()), NULL),
    (2, N'Quần jean nam slim fit', N'quan-jean-nam-slim-fit', N'Quần jean nam chất liệu denim co giãn, form slim fit trẻ trung, năng động.', 450000, 1, 1, 32, DATEADD(day, -25, GETDATE()), DATEADD(day, -25, GETDATE()), NULL),
    (3, N'Áo sơ mi nam dài tay', N'ao-so-mi-nam-dai-tay', N'Áo sơ mi nam công sở, chất liệu kate cao cấp, không nhăn, form regular.', 350000, 1, 1, 28, DATEADD(day, -20, GETDATE()), DATEADD(day, -20, GETDATE()), NULL),
    (4, N'Quần kaki nam ống đứng', N'quan-kaki-nam-ong-dung', N'Quần kaki nam chất liệu cotton pha, thoáng mát, form ống đứng lịch sự.', 380000, 1, 1, 19, DATEADD(day, -15, GETDATE()), DATEADD(day, -15, GETDATE()), NULL),
    
    -- ThờI trang nữ (category_id = 2)
    (5, N'Váy đầm nữ dự tiệc', N'vay-dam-nu-du-tiec', N'Váy đầm nữ thiết kế thanh lịch, phù hợp dự tiệc và sự kiện. Chất liệu voan cao cấp.', 650000, 2, 1, 67, DATEADD(day, -28, GETDATE()), DATEADD(day, -28, GETDATE()), NULL),
    (6, N'Áo kiểu nữ tay bèo', N'ao-kieu-nu-tay-beo', N'Áo kiểu nữ thiết kế tay bèo nữ tính, chất liệu chiffon nhẹ nhàng, thoáng mát.', 280000, 2, 1, 54, DATEADD(day, -22, GETDATE()), DATEADD(day, -22, GETDATE()), NULL),
    (7, N'Chân váy nữ xếp ly', N'chan-vay-nu-xep-ly', N'Chân váy nữ xếp ly dài, form chữ A tôn dáng. Chất liệu vải tuyết mưa mềm mại.', 320000, 2, 1, 41, DATEADD(day, -18, GETDATE()), DATEADD(day, -18, GETDATE()), NULL),
    (8, N'Áo khoác nữ blazer', N'ao-khoac-nu-blazer', N'Áo khoác blazer nữ form dáng công sở, chất liệu vải tuyết mưa cao cấp.', 550000, 2, 1, 23, DATEADD(day, -12, GETDATE()), DATEADD(day, -12, GETDATE()), NULL),
    
    -- Phụ kiện (category_id = 3)
    (9, N'Túi xách nữ thờI trang', N'tui-xach-nu-thoi-trang', N'Túi xách nữ thiết kế hiện đại, chất liệu da PU cao cấp, nhiều ngăn tiện lợi.', 420000, 3, 1, 89, DATEADD(day, -35, GETDATE()), DATEADD(day, -35, GETDATE()), NULL),
    (10, N'Đồng hồ nam dây da', N'dong-ho-nam-day-da', N'Đồng hồ nam phong cách classic, mặt kính sapphire chống xước, dây da cao cấp.', 850000, 3, 1, 15, DATEADD(day, -10, GETDATE()), DATEADD(day, -10, GETDATE()), NULL),
    (11, N'Kính mát thờI trang unisex', N'kinh-mat-thoi-trang-unisex', N'Kính mát thờI trang thiết kế unisex, gọng kim loại cao cấp, tròng chống UV.', 290000, 3, 1, 76, DATEADD(day, -26, GETDATE()), DATEADD(day, -26, GETDATE()), NULL),
    (12, N'Ví nam da bò thật', N'vi-nam-da-bo-that', N'Ví nam chất liệu da bò thật 100%, bền đẹp theo thờI gian, nhiều ngăn đựng thẻ.', 380000, 3, 1, 38, DATEADD(day, -14, GETDATE()), DATEADD(day, -14, GETDATE()), NULL);
GO

SET IDENTITY_INSERT products OFF;
GO

-- =============================================
-- 4. PRODUCT VARIANTS (2-4 biến thể mỗi sản phẩm)
-- =============================================
SET IDENTITY_INSERT product_variants ON;
GO

INSERT INTO product_variants (id, product_id, color, size, sku, stock_quantity, price_adjustment, is_available, created_at, updated_at, deleted_at)
VALUES 
    -- Product 1: Áo thun nam (M/Đen, L/Đen, M/Trắng, L/Trắng)
    (1, 1, N'Đen', N'M', N'SKU-001-M-BLACK', 100, 0, 1, GETDATE(), GETDATE(), NULL),
    (2, 1, N'Đen', N'L', N'SKU-001-L-BLACK', 80, 0, 1, GETDATE(), GETDATE(), NULL),
    (3, 1, N'Trắng', N'M', N'SKU-001-M-WHITE', 120, 0, 1, GETDATE(), GETDATE(), NULL),
    (4, 1, N'Trắng', N'L', N'SKU-001-L-WHITE', 90, 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 2: Quần jean nam (32/Xanh đậm, 33/Xanh đậm, 34/Xanh nhạt)
    (5, 2, N'Xanh đậm', N'32', N'SKU-002-32-DARK', 50, 0, 1, GETDATE(), GETDATE(), NULL),
    (6, 2, N'Xanh đậm', N'33', N'SKU-002-33-DARK', 45, 0, 1, GETDATE(), GETDATE(), NULL),
    (7, 2, N'Xanh nhạt', N'32', N'SKU-002-32-LIGHT', 60, 20000, 1, GETDATE(), GETDATE(), NULL),
    (8, 2, N'Xanh nhạt', N'34', N'SKU-002-34-LIGHT', 55, 20000, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 3: Áo sơ mi nam (M/Trắng, L/Trắng, XL/Xanh nhạt)
    (9, 3, N'Trắng', N'M', N'SKU-003-M-WHITE', 75, 0, 1, GETDATE(), GETDATE(), NULL),
    (10, 3, N'Trắng', N'L', N'SKU-003-L-WHITE', 65, 0, 1, GETDATE(), GETDATE(), NULL),
    (11, 3, N'Xanh nhạt', N'XL', N'SKU-003-XL-BLUE', 50, 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 4: Quần kaki nam (30/Be, 32/Be, 32/Đen)
    (12, 4, N'Be', N'30', N'SKU-004-30-BEIGE', 80, 0, 1, GETDATE(), GETDATE(), NULL),
    (13, 4, N'Be', N'32', N'SKU-004-32-BEIGE', 70, 0, 1, GETDATE(), GETDATE(), NULL),
    (14, 4, N'Đen', N'32', N'SKU-004-32-BLACK', 60, 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 5: Váy đầm nữ (S/Đỏ, M/Đỏ, L/Đen)
    (15, 5, N'Đỏ', N'S', N'SKU-005-S-RED', 40, 0, 1, GETDATE(), GETDATE(), NULL),
    (16, 5, N'Đỏ', N'M', N'SKU-005-M-RED', 35, 0, 1, GETDATE(), GETDATE(), NULL),
    (17, 5, N'Đen', N'L', N'SKU-005-L-BLACK', 45, 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 6: Áo kiểu nữ (S/Hồng, M/Hồng, M/Trắng)
    (18, 6, N'Hồng', N'S', N'SKU-006-S-PINK', 85, 0, 1, GETDATE(), GETDATE(), NULL),
    (19, 6, N'Hồng', N'M', N'SKU-006-M-PINK', 90, 0, 1, GETDATE(), GETDATE(), NULL),
    (20, 6, N'Trắng', N'M', N'SKU-006-M-WHITE', 70, 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 7: Chân váy nữ (S/Đen, M/Be, L/Đen)
    (21, 7, N'Đen', N'S', N'SKU-007-S-BLACK', 55, 0, 1, GETDATE(), GETDATE(), NULL),
    (22, 7, N'Be', N'M', N'SKU-007-M-BEIGE', 50, 0, 1, GETDATE(), GETDATE(), NULL),
    (23, 7, N'Đen', N'L', N'SKU-007-L-BLACK', 45, 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 8: Áo khoác blazer (S/Đen, M/Be)
    (24, 8, N'Đen', N'S', N'SKU-008-S-BLACK', 30, 0, 1, GETDATE(), GETDATE(), NULL),
    (25, 8, N'Be', N'M', N'SKU-008-M-BEIGE', 35, 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 9: Túi xách nữ (Size chuẩn/Đen, Size chuẩn/Nâu)
    (26, 9, N'Đen', N'Size chuẩn', N'SKU-009-STD-BLACK', 60, 0, 1, GETDATE(), GETDATE(), NULL),
    (27, 9, N'Nâu', N'Size chuẩn', N'SKU-009-STD-BROWN', 55, 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 10: Đồng hồ nam (Size chuẩn/Bạc, Size chuẩn/Vàng)
    (28, 10, N'Bạc', N'Size chuẩn', N'SKU-010-STD-SILVER', 25, 0, 1, GETDATE(), GETDATE(), NULL),
    (29, 10, N'Vàng', N'Size chuẩn', N'SKU-010-STD-GOLD', 20, 50000, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 11: Kính mát (Size chuẩn/Đen, Size chuẩn/Nâu)
    (30, 11, N'Đen', N'Size chuẩn', N'SKU-011-STD-BLACK', 100, 0, 1, GETDATE(), GETDATE(), NULL),
    (31, 11, N'Nâu', N'Size chuẩn', N'SKU-011-STD-BROWN', 85, 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 12: Ví nam (Size chuẩn/Nâu, Size chuẩn/Đen)
    (32, 12, N'Nâu', N'Size chuẩn', N'SKU-012-STD-BROWN', 40, 0, 1, GETDATE(), GETDATE(), NULL),
    (33, 12, N'Đen', N'Size chuẩn', N'SKU-012-STD-BLACK', 45, 0, 1, GETDATE(), GETDATE(), NULL);
GO

SET IDENTITY_INSERT product_variants OFF;
GO

-- =============================================
-- 5. PRODUCT IMAGES (1-2 ảnh mỗi sản phẩm)
-- =============================================
SET IDENTITY_INSERT product_images ON;
GO

INSERT INTO product_images (id, product_id, image_url, alt_text, sort_order, is_primary, created_at, updated_at, deleted_at)
VALUES 
    -- Product 1: Áo thun nam
    (1, 1, N'/uploads/ao-thun-nam-co-tron-basic-1.jpg', N'Áo thun nam cổ tròn basic', 0, 1, GETDATE(), GETDATE(), NULL),
    (2, 1, N'/uploads/ao-thun-nam-co-tron-basic-2.jpg', N'Áo thun nam chi tiết', 1, 0, GETDATE(), GETDATE(), NULL),
    
    -- Product 2: Quần jean nam
    (3, 2, N'/uploads/quan-jean-nam-slim-fit-1.jpg', N'Quần jean nam slim fit', 0, 1, GETDATE(), GETDATE(), NULL),
    (4, 2, N'/uploads/quan-jean-nam-slim-fit-2.jpg', N'Quần jean nam chi tiết', 1, 0, GETDATE(), GETDATE(), NULL),
    
    -- Product 3: Áo sơ mi nam
    (5, 3, N'/uploads/ao-so-mi-nam-dai-tay-1.jpg', N'Áo sơ mi nam dài tay', 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 4: Quần kaki nam
    (6, 4, N'/uploads/quan-kaki-nam-ong-dung-1.jpg', N'Quần kaki nam ống đứng', 0, 1, GETDATE(), GETDATE(), NULL),
    (7, 4, N'/uploads/quan-kaki-nam-ong-dung-2.jpg', N'Quần kaki nam chi tiết', 1, 0, GETDATE(), GETDATE(), NULL),
    
    -- Product 5: Váy đầm nữ
    (8, 5, N'/uploads/vay-dam-nu-du-tiec-1.jpg', N'Váy đầm nữ dự tiệc', 0, 1, GETDATE(), GETDATE(), NULL),
    (9, 5, N'/uploads/vay-dam-nu-du-tiec-2.jpg', N'Váy đầm nữ chi tiết', 1, 0, GETDATE(), GETDATE(), NULL),
    
    -- Product 6: Áo kiểu nữ
    (10, 6, N'/uploads/ao-kieu-nu-tay-beo-1.jpg', N'Áo kiểu nữ tay bèo', 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 7: Chân váy nữ
    (11, 7, N'/uploads/chan-vay-nu-xep-ly-1.jpg', N'Chân váy nữ xếp ly', 0, 1, GETDATE(), GETDATE(), NULL),
    (12, 7, N'/uploads/chan-vay-nu-xep-ly-2.jpg', N'Chân váy nữ chi tiết', 1, 0, GETDATE(), GETDATE(), NULL),
    
    -- Product 8: Áo khoác blazer
    (13, 8, N'/uploads/ao-khoac-nu-blazer-1.jpg', N'Áo khoác nữ blazer', 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 9: Túi xách nữ
    (14, 9, N'/uploads/tui-xach-nu-thoi-trang-1.jpg', N'Túi xách nữ thờI trang', 0, 1, GETDATE(), GETDATE(), NULL),
    (15, 9, N'/uploads/tui-xach-nu-thoi-trang-2.jpg', N'Túi xách nữ chi tiết', 1, 0, GETDATE(), GETDATE(), NULL),
    
    -- Product 10: Đồng hồ nam
    (16, 10, N'/uploads/dong-ho-nam-day-da-1.jpg', N'Đồng hồ nam dây da', 0, 1, GETDATE(), GETDATE(), NULL),
    
    -- Product 11: Kính mát
    (17, 11, N'/uploads/kinh-mat-thoi-trang-unisex-1.jpg', N'Kính mát thờI trang unisex', 0, 1, GETDATE(), GETDATE(), NULL),
    (18, 11, N'/uploads/kinh-mat-thoi-trang-unisex-2.jpg', N'Kính mát chi tiết', 1, 0, GETDATE(), GETDATE(), NULL),
    
    -- Product 12: Ví nam
    (19, 12, N'/uploads/vi-nam-da-bo-that-1.jpg', N'Ví nam da bò thật', 0, 1, GETDATE(), GETDATE(), NULL);
GO

SET IDENTITY_INSERT product_images OFF;
GO

-- =============================================
-- 6. CARTS (2 giỏ hàng cho user 2 và 3)
-- =============================================
SET IDENTITY_INSERT carts ON;
GO

INSERT INTO carts (id, user_id, created_at, updated_at, deleted_at)
VALUES 
    (1, 2, GETDATE(), GETDATE(), NULL),
    (2, 3, DATEADD(day, -1, GETDATE()), DATEADD(day, -1, GETDATE()), NULL);
GO

SET IDENTITY_INSERT carts OFF;
GO

-- =============================================
-- 7. CART ITEMS
-- =============================================
SET IDENTITY_INSERT cart_items ON;
GO

INSERT INTO cart_items (id, cart_id, variant_id, qty, created_at, updated_at, deleted_at)
VALUES 
    -- Cart 1 của user 2 (Nguyễn Văn A)
    (1, 1, 1, 2, GETDATE(), GETDATE(), NULL),   -- Áo thun nam Đen M x2
    (2, 1, 5, 1, GETDATE(), GETDATE(), NULL),   -- Quần jean Xanh đậm 32 x1
    (3, 1, 26, 1, GETDATE(), GETDATE(), NULL),  -- Túi xách Đen x1
    
    -- Cart 2 của user 3 (Trần Thị B)
    (4, 2, 15, 1, GETDATE(), GETDATE(), NULL),  -- Váy đầm Đỏ S x1
    (5, 2, 18, 2, GETDATE(), GETDATE(), NULL);  -- Áo kiểu Hồng S x2
GO

SET IDENTITY_INSERT cart_items OFF;
GO

-- =============================================
-- 8. ORDERS (6 đơn hàng với đầy đủ status)
-- =============================================
SET IDENTITY_INSERT orders ON;
GO

INSERT INTO orders (id, order_code, user_id, total, status, shipping_address, phone, note, created_at, updated_at, deleted_at)
VALUES 
    -- User 2: Nguyễn Văn A
    (1, N'ORD20260131001', 2, 1048000, N'delivered', N'123 Nguyễn Văn A, Quận 1, TP.HCM', N'0912345678', N'Giao giờ hành chính', DATEADD(day, -10, GETDATE()), DATEADD(day, -5, GETDATE()), NULL),
    (2, N'ORD20260131002', 2, 650000, N'shipped', N'123 Nguyễn Văn A, Quận 1, TP.HCM', N'0912345678', NULL, DATEADD(day, -3, GETDATE()), DATEADD(day, -1, GETDATE()), NULL),
    (3, N'ORD20260131003', 2, 380000, N'pending', N'123 Nguyễn Văn A, Quận 1, TP.HCM', N'0912345678', N'Gọi trước khi giao', DATEADD(day, -1, GETDATE()), DATEADD(day, -1, GETDATE()), NULL),
    
    -- User 3: Trần Thị B
    (4, N'ORD20260131004', 3, 970000, N'delivered', N'456 Trần Thị B, Quận 3, TP.HCM', N'0987654321', NULL, DATEADD(day, -15, GETDATE()), DATEADD(day, -10, GETDATE()), NULL),
    (5, N'ORD20260131005', 3, 320000, N'confirmed', N'456 Trần Thị B, Quận 3, TP.HCM', N'0987654321', N'Đóng gói cẩn thận', DATEADD(day, -2, GETDATE()), DATEADD(day, -1, GETDATE()), NULL),
    
    -- User 4: Lê Thị C (Cancelled order)
    (6, N'ORD20260131006', 4, 850000, N'cancelled', N'789 Lê Thị C, Quận 5, TP.HCM', N'0909123457', N'Khách hủy đơn', DATEADD(day, -5, GETDATE()), DATEADD(day, -4, GETDATE()), NULL);
GO

SET IDENTITY_INSERT orders OFF;
GO

-- =============================================
-- 9. ORDER ITEMS
-- =============================================
SET IDENTITY_INSERT order_items ON;
GO

INSERT INTO order_items (id, order_id, product_name_snapshot, variant_info_snapshot, qty, unit_price, created_at, updated_at, deleted_at)
VALUES 
    -- Order 1: DELIVERED (3 items)
    (1, 1, N'Áo thun nam cổ tròn basic', N'Đen - M', 2, 199000, DATEADD(day, -10, GETDATE()), DATEADD(day, -10, GETDATE()), NULL),
    (2, 1, N'Quần jean nam slim fit', N'Xanh đậm - 32', 1, 450000, DATEADD(day, -10, GETDATE()), DATEADD(day, -10, GETDATE()), NULL),
    (3, 1, N'Ví nam da bò thật', N'Nâu - Size chuẩn', 1, 380000, DATEADD(day, -10, GETDATE()), DATEADD(day, -10, GETDATE()), NULL),
    
    -- Order 2: SHIPPED (2 items)
    (4, 2, N'Váy đầm nữ dự tiệc', N'Đỏ - S', 1, 650000, DATEADD(day, -3, GETDATE()), DATEADD(day, -3, GETDATE()), NULL),
    
    -- Order 3: PENDING (1 item)
    (5, 3, N'Quần kaki nam ống đứng', N'Be - 30', 1, 380000, DATEADD(day, -1, GETDATE()), DATEADD(day, -1, GETDATE()), NULL),
    
    -- Order 4: DELIVERED (2 items)
    (6, 4, N'Chân váy nữ xếp ly', N'Be - M', 1, 320000, DATEADD(day, -15, GETDATE()), DATEADD(day, -15, GETDATE()), NULL),
    (7, 4, N'Áo kiểu nữ tay bèo', N'Hồng - M', 2, 280000, DATEADD(day, -15, GETDATE()), DATEADD(day, -15, GETDATE()), NULL),
    
    -- Order 5: CONFIRMED (1 item)
    (8, 5, N'Chân váy nữ xếp ly', N'Đen - S', 1, 320000, DATEADD(day, -2, GETDATE()), DATEADD(day, -2, GETDATE()), NULL),
    
    -- Order 6: CANCELLED (1 item)
    (9, 6, N'Đồng hồ nam dây da', N'Bạc - Size chuẩn', 1, 850000, DATEADD(day, -5, GETDATE()), DATEADD(day, -5, GETDATE()), NULL);
GO

SET IDENTITY_INSERT order_items OFF;
GO

-- =============================================
-- 10. PAYMENTS
-- =============================================
SET IDENTITY_INSERT payments ON;
GO

INSERT INTO payments (id, order_id, method, amount, status, transaction_code, paid_at, notes, created_at, updated_at, deleted_at)
VALUES 
    -- Order 1: DELIVERED -> PAID (COD)
    (1, 1, N'COD', 1048000, N'PAID', NULL, DATEADD(day, -5, GETDATE()), N'Khách đã thanh toán', DATEADD(day, -10, GETDATE()), DATEADD(day, -5, GETDATE()), NULL),
    
    -- Order 2: SHIPPED -> PENDING (COD)
    (2, 2, N'COD', 650000, N'PENDING', NULL, NULL, NULL, DATEADD(day, -3, GETDATE()), DATEADD(day, -1, GETDATE()), NULL),
    
    -- Order 3: PENDING -> PENDING (BANK_TRANSFER)
    (3, 3, N'BANK_TRANSFER', 380000, N'PENDING', NULL, NULL, N'Chờ khách chuyển khoản', DATEADD(day, -1, GETDATE()), DATEADD(day, -1, GETDATE()), NULL),
    
    -- Order 4: DELIVERED -> PAID (COD)
    (4, 4, N'COD', 970000, N'PAID', NULL, DATEADD(day, -10, GETDATE()), NULL, DATEADD(day, -15, GETDATE()), DATEADD(day, -10, GETDATE()), NULL),
    
    -- Order 5: CONFIRMED -> PENDING (BANK_TRANSFER)
    (5, 5, N'BANK_TRANSFER', 320000, N'PENDING', NULL, NULL, NULL, DATEADD(day, -2, GETDATE()), DATEADD(day, -1, GETDATE()), NULL),
    
    -- Order 6: CANCELLED -> FAILED
    (6, 6, N'COD', 850000, N'FAILED', NULL, NULL, N'Đơn hàng đã bị hủy', DATEADD(day, -5, GETDATE()), DATEADD(day, -4, GETDATE()), NULL);
GO

SET IDENTITY_INSERT payments OFF;
GO

-- =============================================
-- 11. PRODUCT REVIEWS (3-4 đánh giá cho sản phẩm đã DELIVERED)
-- =============================================
SET IDENTITY_INSERT product_reviews ON;
GO

INSERT INTO product_reviews (id, user_id, product_id, rating, content, is_verified_purchase, created_at, updated_at, deleted_at)
VALUES 
    -- Reviews cho Order 1 (User 2 đã mua và nhận hàng)
    (1, 2, 1, 5, N'Áo thun chất lượng rất tốt, vải mềm mại, thoáng mát. Mình đã mua 2 cái và rất hài lòng!', 1, DATEADD(day, -3, GETDATE()), DATEADD(day, -3, GETDATE()), NULL),
    (2, 2, 2, 4, N'Quần jean form đẹp, chất vải dày dặn. Giao hàng nhanh chóng.', 1, DATEADD(day, -3, GETDATE()), DATEADD(day, -3, GETDATE()), NULL),
    
    -- Reviews cho Order 4 (User 3 đã mua và nhận hàng)
    (3, 3, 7, 5, N'Chân váy xếp ly rất đẹp, mặc lên tôn dáng lắm. Màu be sang trọng!', 1, DATEADD(day, -7, GETDATE()), DATEADD(day, -7, GETDATE()), NULL),
    (4, 3, 6, 4, N'Áo kiểu tay bèo xinh xắn, phù hợp đi làm và đi chơi. Chất liệu mát.', 1, DATEADD(day, -8, GETDATE()), DATEADD(day, -8, GETDATE()), NULL);
GO

SET IDENTITY_INSERT product_reviews OFF;
GO

-- =============================================
-- 12. WISHLISTS (2-3 user có wishlist)
-- =============================================
SET IDENTITY_INSERT wishlists ON;
GO

INSERT INTO wishlists (id, user_id, product_id, created_at, updated_at, deleted_at)
VALUES 
    -- User 2: Nguyễn Văn A (3 sản phẩm)
    (1, 2, 3, GETDATE(), GETDATE(), NULL),   -- Áo sơ mi nam
    (2, 2, 10, GETDATE(), GETDATE(), NULL),  -- Đồng hồ nam
    (3, 2, 11, GETDATE(), GETDATE(), NULL),  -- Kính mát
    
    -- User 3: Trần Thị B (2 sản phẩm)
    (4, 3, 5, DATEADD(day, -2, GETDATE()), DATEADD(day, -2, GETDATE()), NULL),   -- Váy đầm
    (5, 3, 8, DATEADD(day, -2, GETDATE()), DATEADD(day, -2, GETDATE()), NULL),   -- Áo khoác blazer
    
    -- User 4: Lê Thị C (2 sản phẩm)
    (6, 4, 9, DATEADD(day, -1, GETDATE()), DATEADD(day, -1, GETDATE()), NULL),   -- Túi xách
    (7, 4, 12, DATEADD(day, -1, GETDATE()), DATEADD(day, -1, GETDATE()), NULL);  -- Ví nam
GO

SET IDENTITY_INSERT wishlists OFF;
GO

-- =============================================
-- 13. COUPONS (2 mã giảm giá mẫu)
-- =============================================
SET IDENTITY_INSERT coupons ON;
GO

INSERT INTO coupons (id, code, type, value, start_date, end_date, max_usage, used_count, created_at, updated_at, deleted_at)
VALUES 
    (1, N'WELCOME10', N'percent', 10, DATEADD(day, -30, GETDATE()), DATEADD(day, 30, GETDATE()), 100, 12, GETDATE(), GETDATE(), NULL),
    (2, N'SALE50K', N'fixed', 50000, DATEADD(day, -15, GETDATE()), DATEADD(day, 15, GETDATE()), 50, 8, GETDATE(), GETDATE(), NULL);
GO

SET IDENTITY_INSERT coupons OFF;
GO

-- =============================================
-- SEED DATA COMPLETED
-- =============================================
PRINT 'Seed data inserted successfully!';
PRINT 'Summary:';
PRINT '  - Users: 5 (1 admin, 4 customers)';
PRINT '  - Categories: 3 (no sub-categories)';
PRINT '  - Products: 12 (4 per category)';
PRINT '  - Product Variants: 33';
PRINT '  - Product Images: 19';
PRINT '  - Carts: 2';
PRINT '  - Cart Items: 5';
PRINT '  - Orders: 6 (various statuses)';
PRINT '  - Order Items: 9';
PRINT '  - Payments: 6';
PRINT '  - Reviews: 4';
PRINT '  - Wishlists: 7 entries';
PRINT '  - Coupons: 2';
GO
