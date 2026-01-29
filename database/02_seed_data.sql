-- =============================================
-- FASH.ON REBORN - SEED DATA
-- Created: 2026-01-29
-- Tech: SQL Server 2022
-- =============================================

USE fashon_db;
GO

-- =============================================
-- USERS (1 admin + 2 customers)
-- =============================================
INSERT INTO users (email, password_hash, full_name, phone, role, created_at, updated_at)
VALUES 
    (N'admin@fashon.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzFRCJ1BX9P4Q.FG3vH7X.Lm3M2', N'Quản Trị Viên', N'0909123456', 'admin', GETDATE(), GETDATE()),
    (N'nguyenvana@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzFRCJ1BX9P4Q.FG3vH7X.Lm3M2', N'Nguyễn Văn A', N'0912345678', 'customer', GETDATE(), GETDATE()),
    (N'tranthib@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzFRCJ1BX9P4Q.FG3vH7X.Lm3M2', N'Trần Thị B', N'0987654321', 'customer', GETDATE(), GETDATE());
GO

-- =============================================
-- CATEGORIES (Tree structure: parent-child)
-- =============================================
-- Parent categories
INSERT INTO categories (name, slug, description, parent_id, created_at, updated_at)
VALUES 
    (N'ThờI Trang Nam', N'thoi-trang-nam', N'Bộ sưu tập thờI trang nam tính, hiện đạI', NULL, GETDATE(), GETDATE()),
    (N'ThờI Trang Nữ', N'thoi-trang-nu', N'Bộ sưu tập thờI trang nữ thanh lịch', NULL, GETDATE(), GETDATE()),
    (N'Phụ Kiện', N'phu-kien', N'Các loạI phụ kiện thờI trang', NULL, GETDATE(), GETDATE());
GO

-- Child categories (Nam)
INSERT INTO categories (name, slug, description, parent_id, created_at, updated_at)
VALUES 
    (N'Áo Nam', N'ao-nam', N'Áo thun, áo sơ mI, áo polo nam', 1, GETDATE(), GETDATE()),
    (N'Quần Nam', N'quan-nam', N'Quần jean, quần kakI, quần short nam', 1, GETDATE(), GETDATE());
GO

-- Child categories (Nữ)
INSERT INTO categories (name, slug, description, parent_id, created_at, updated_at)
VALUES 
    (N'Áo Nữ', N'ao-nu', N'Áo thun, áo sơ mI, áo kiểu nữ', 2, GETDATE(), GETDATE()),
    (N'Váy Đầm', N'vay-dam', N'Váy, đầm thờI trang nữ', 2, GETDATE(), GETDATE());
GO

-- =============================================
-- PRODUCTS
-- =============================================
INSERT INTO products (name, slug, description, base_price, category_id, status, created_at, updated_at)
VALUES 
    (N'Áo Thun Nam Cotton Cao Cấp', N'ao-thun-nam-cotton-cao-cap', N'Áo thun nam chất liệu cotton 100%, thoáng mát, thấm hút mồ hôI tốt, phù hợp mặc hè', 99000.0000, 4, 'active', GETDATE(), GETDATE()),
    (N'Quần Jean Ống Rộng Nam', N'quan-jean-ong-rong-nam', N'Quần jean ống rộng phong cách streetwear, chất jean dày dặn, form chuẩn', 299000.0000, 5, 'active', GETDATE(), GETDATE()),
    (N'Áo Sơ MI Nữ Công Sở', N'ao-so-mi-nu-cong-so', N'Áo sơ mI nữ tay dàI, chất liệu lụa mềm mạI, phù hợp đI làm công sở', 149000.0000, 6, 'active', GETDATE(), GETDATE()),
    (N'Váy Đầm Dạ HộI', N'vay-dam-da-hoi', N'Váy đầm dự tiệc sang trọng, thiết kế tinh tế, tôn dáng', 599000.0000, 7, 'active', GETDATE(), GETDATE());
GO

-- =============================================
-- PRODUCT VARIANTS
-- =============================================
-- Product 1: Áo Thun Nam Cotton (Size M/L/XL + Màu Đen/Trắng/Xanh)
INSERT INTO product_variants (product_id, color, size, sku, stock_qty, price_adjustment, created_at, updated_at)
VALUES 
    (1, N'Đen', N'M', N'ATN-CC-DEN-M', 50, 0.0000, GETDATE(), GETDATE()),
    (1, N'Đen', N'L', N'ATN-CC-DEN-L', 45, 0.0000, GETDATE(), GETDATE()),
    (1, N'Đen', N'XL', N'ATN-CC-DEN-XL', 40, 5000.0000, GETDATE(), GETDATE()),
    (1, N'Trắng', N'M', N'ATN-CC-TRANG-M', 60, 0.0000, GETDATE(), GETDATE()),
    (1, N'Trắng', N'L', N'ATN-CC-TRANG-L', 55, 0.0000, GETDATE(), GETDATE()),
    (1, N'Trắng', N'XL', N'ATN-CC-TRANG-XL', 50, 5000.0000, GETDATE(), GETDATE()),
    (1, N'Xanh Navy', N'M', N'ATN-CC-NAVY-M', 40, 10000.0000, GETDATE(), GETDATE()),
    (1, N'Xanh Navy', N'L', N'ATN-CC-NAVY-L', 35, 10000.0000, GETDATE(), GETDATE()),
    (1, N'Xanh Navy', N'XL', N'ATN-CC-NAVY-XL', 30, 15000.0000, GETDATE(), GETDATE());
GO

-- Product 2: Quần Jean Ống Rộng
INSERT INTO product_variants (product_id, color, size, sku, stock_qty, price_adjustment, created_at, updated_at)
VALUES 
    (2, N'Xanh Đậm', N'28', N'QJOR-XD-28', 30, 0.0000, GETDATE(), GETDATE()),
    (2, N'Xanh Đậm', N'29', N'QJOR-XD-29', 35, 0.0000, GETDATE(), GETDATE()),
    (2, N'Xanh Đậm', N'30', N'QJOR-XD-30', 40, 0.0000, GETDATE(), GETDATE()),
    (2, N'Xanh Đậm', N'31', N'QJOR-XD-31', 35, 0.0000, GETDATE(), GETDATE()),
    (2, N'Xanh Nhạt', N'28', N'QJOR-XN-28', 25, 0.0000, GETDATE(), GETDATE()),
    (2, N'Xanh Nhạt', N'29', N'QJOR-XN-29', 30, 0.0000, GETDATE(), GETDATE()),
    (2, N'Xanh Nhạt', N'30', N'QJOR-XN-30', 35, 0.0000, GETDATE(), GETDATE()),
    (2, N'Xanh Nhạt', N'31', N'QJOR-XN-31', 30, 0.0000, GETDATE(), GETDATE()),
    (2, N'Đen', N'28', N'QJOR-DEN-28', 20, 10000.0000, GETDATE(), GETDATE()),
    (2, N'Đen', N'29', N'QJOR-DEN-29', 25, 10000.0000, GETDATE(), GETDATE()),
    (2, N'Đen', N'30', N'QJOR-DEN-30', 30, 10000.0000, GETDATE(), GETDATE()),
    (2, N'Đen', N'31', N'QJOR-DEN-31', 25, 10000.0000, GETDATE(), GETDATE());
GO

-- Product 3: Áo Sơ MI Nữ
INSERT INTO product_variants (product_id, color, size, sku, stock_qty, price_adjustment, created_at, updated_at)
VALUES 
    (3, N'Trắng', N'S', N'ASMNU-TRANG-S', 40, 0.0000, GETDATE(), GETDATE()),
    (3, N'Trắng', N'M', N'ASMNU-TRANG-M', 50, 0.0000, GETDATE(), GETDATE()),
    (3, N'Trắng', N'L', N'ASMNU-TRANG-L', 45, 0.0000, GETDATE(), GETDATE()),
    (3, N'Hồng Nhạt', N'S', N'ASMNU-HONG-S', 35, 5000.0000, GETDATE(), GETDATE()),
    (3, N'Hồng Nhạt', N'M', N'ASMNU-HONG-M', 40, 5000.0000, GETDATE(), GETDATE()),
    (3, N'Hồng Nhạt', N'L', N'ASMNU-HONG-L', 35, 5000.0000, GETDATE(), GETDATE()),
    (3, N'Xanh Da TrờI', N'S', N'ASMNU-XDT-S', 30, 5000.0000, GETDATE(), GETDATE()),
    (3, N'Xanh Da TrờI', N'M', N'ASMNU-XDT-M', 35, 5000.0000, GETDATE(), GETDATE()),
    (3, N'Xanh Da TrờI', N'L', N'ASMNU-XDT-L', 30, 5000.0000, GETDATE(), GETDATE());
GO

-- Product 4: Váy Đầm Dạ HộI
INSERT INTO product_variants (product_id, color, size, sku, stock_qty, price_adjustment, created_at, updated_at)
VALUES 
    (4, N'Đỏ', N'S', N'VDDH-DO-S', 20, 0.0000, GETDATE(), GETDATE()),
    (4, N'Đỏ', N'M', N'VDDH-DO-M', 25, 0.0000, GETDATE(), GETDATE()),
    (4, N'Đỏ', N'L', N'VDDH-DO-L', 20, 0.0000, GETDATE(), GETDATE()),
    (4, N'Đen', N'S', N'VDDH-DEN-S', 15, 0.0000, GETDATE(), GETDATE()),
    (4, N'Đen', N'M', N'VDDH-DEN-M', 20, 0.0000, GETDATE(), GETDATE()),
    (4, N'Đen', N'L', N'VDDH-DEN-L', 15, 0.0000, GETDATE(), GETDATE()),
    (4, N'Xanh Cobalt', N'S', N'VDDH-COBALT-S', 10, 10000.0000, GETDATE(), GETDATE()),
    (4, N'Xanh Cobalt', N'M', N'VDDH-COBALT-M', 15, 10000.0000, GETDATE(), GETDATE()),
    (4, N'Xanh Cobalt', N'L', N'VDDH-COBALT-L', 10, 10000.0000, GETDATE(), GETDATE());
GO

-- =============================================
-- PRODUCT IMAGES
-- =============================================
INSERT INTO product_images (product_id, file_path, alt_text, sort_order, created_at, updated_at)
VALUES 
    -- Product 1: Áo Thun Nam Cotton
    (1, N'/backend/uploads/products/ao-thun-nam-cotton-1.jpg', N'Áo thun nam cotton màu đen', 1, GETDATE(), GETDATE()),
    (1, N'/backend/uploads/products/ao-thun-nam-cotton-2.jpg', N'Áo thun nam cotton màu trắng', 2, GETDATE(), GETDATE()),
    (1, N'/backend/uploads/products/ao-thun-nam-cotton-3.jpg', N'Áo thun nam cotton màu xanh navy', 3, GETDATE(), GETDATE()),
    
    -- Product 2: Quần Jean Ống Rộng
    (2, N'/backend/uploads/products/quan-jean-ong-rong-1.jpg', N'Quần jean ống rộng xanh đậm', 1, GETDATE(), GETDATE()),
    (2, N'/backend/uploads/products/quan-jean-ong-rong-2.jpg', N'Quần jean ống rộng xanh nhạt', 2, GETDATE(), GETDATE()),
    (2, N'/backend/uploads/products/quan-jean-ong-rong-3.jpg', N'Quần jean ống rộng màu đen', 3, GETDATE(), GETDATE()),
    
    -- Product 3: Áo Sơ MI Nữ
    (3, N'/backend/uploads/products/ao-so-mi-nu-1.jpg', N'Áo sơ mI nữ màu trắng', 1, GETDATE(), GETDATE()),
    (3, N'/backend/uploads/products/ao-so-mi-nu-2.jpg', N'Áo sơ mI nữ màu hồng nhạt', 2, GETDATE(), GETDATE()),
    (3, N'/backend/uploads/products/ao-so-mi-nu-3.jpg', N'Áo sơ mI nữ màu xanh da trờI', 3, GETDATE(), GETDATE()),
    
    -- Product 4: Váy Đầm Dạ HộI
    (4, N'/backend/uploads/products/vay-dam-da-hoi-1.jpg', N'Váy đầm dạ hộI màu đỏ', 1, GETDATE(), GETDATE()),
    (4, N'/backend/uploads/products/vay-dam-da-hoi-2.jpg', N'Váy đầm dạ hộI màu đen', 2, GETDATE(), GETDATE()),
    (4, N'/backend/uploads/products/vay-dam-da-hoi-3.jpg', N'Váy đầm dạ hộI màu xanh cobalt', 3, GETDATE(), GETDATE());
GO

-- =============================================
-- CARTS
-- =============================================
INSERT INTO carts (user_id, created_at, updated_at)
VALUES 
    (2, GETDATE(), GETDATE()),
    (3, GETDATE(), GETDATE());
GO

-- =============================================
-- CART ITEMS
-- =============================================
INSERT INTO cart_items (cart_id, variant_id, qty, created_at, updated_at)
VALUES 
    (1, 1, 2, GETDATE(), GETDATE()),  -- User 2: 2x Áo thun đen size M
    (1, 12, 1, GETDATE(), GETDATE()), -- User 2: 1x Quần jean đen size 30
    (2, 20, 1, GETDATE(), GETDATE()), -- User 3: 1x Áo sơ mI trắng size M
    (2, 29, 1, GETDATE(), GETDATE()); -- User 3: 1x Váy đầm đỏ size M
GO

-- =============================================
-- ORDERS
-- =============================================
INSERT INTO orders (order_code, user_id, total, status, shipping_address, phone, created_at, updated_at)
VALUES 
    (N'ORD-20260129-001', 2, 398000.0000, 'delivered', N'123 Nguyễn Văn A, Quận 1, TP.HCM', N'0912345678', DATEADD(day, -10, GETDATE()), DATEADD(day, -5, GETDATE())),
    (N'ORD-20260129-002', 2, 149000.0000, 'shipped', N'123 Nguyễn Văn A, Quận 1, TP.HCM', N'0912345678', DATEADD(day, -3, GETDATE()), DATEADD(day, -1, GETDATE())),
    (N'ORD-20260129-003', 3, 299000.0000, 'pending', N'456 Trần Thị B, Quận 3, TP.HCM', N'0987654321', GETDATE(), GETDATE());
GO

-- =============================================
-- ORDER ITEMS
-- =============================================
INSERT INTO order_items (order_id, product_name_snapshot, variant_info_snapshot, qty, unit_price, created_at, updated_at)
VALUES 
    -- Order 1: Áo thun + Quần jean
    (1, N'Áo Thun Nam Cotton Cao Cấp', N'Màu: Đen, Size: M', 2, 99000.0000, DATEADD(day, -10, GETDATE()), DATEADD(day, -10, GETDATE())),
    (1, N'Quần Jean Ống Rộng Nam', N'Màu: Xanh Đậm, Size: 30', 1, 200000.0000, DATEADD(day, -10, GETDATE()), DATEADD(day, -10, GETDATE())),
    
    -- Order 2: Áo sơ mI
    (2, N'Áo Sơ MI Nữ Công Sở', N'Màu: Trắng, Size: M', 1, 149000.0000, DATEADD(day, -3, GETDATE()), DATEADD(day, -3, GETDATE())),
    
    -- Order 3: Quần jean đen
    (3, N'Quần Jean Ống Rộng Nam', N'Màu: Đen, Size: 29', 1, 299000.0000, GETDATE(), GETDATE());
GO

-- =============================================
-- PRODUCT REVIEWS (3 reviews tiếng Việt)
-- =============================================
INSERT INTO product_reviews (user_id, product_id, rating, content, is_verified_purchase, created_at, updated_at)
VALUES 
    (2, 1, 5, N'Áo đẹp vải mát, mặc rất thoảI máI. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop dàI dàI!', 1, DATEADD(day, -8, GETDATE()), DATEADD(day, -8, GETDATE())),
    (2, 2, 4, N'Giao nhanh nhưng size rộng hơn so với bảng size chuẩn. Chất jean đẹp, không bị phai màu sau khi gIặt.', 1, DATEADD(day, -7, GETDATE()), DATEADD(day, -7, GETDATE())),
    (3, 1, 5, N'Mua cho chồng, ổng khen mãI. Chất cotton thật sự, không bị xù lông sau khi gIặt. Đáng đồng tiền bát gạo!', 1, DATEADD(day, -5, GETDATE()), DATEADD(day, -5, GETDATE()));
GO

-- =============================================
-- WISHLISTS
-- =============================================
INSERT INTO wishlists (user_id, product_id, created_at, updated_at)
VALUES 
    (2, 3, GETDATE(), GETDATE()),
    (2, 4, GETDATE(), GETDATE()),
    (3, 1, GETDATE(), GETDATE()),
    (3, 2, GETDATE(), GETDATE());
GO

-- =============================================
-- COUPONS (2 coupons)
-- =============================================
INSERT INTO coupons (code, type, value, start_date, end_date, max_usage, used_count, created_at, updated_at)
VALUES 
    (N'SALE10', N'percent', 10.0000, DATEADD(day, -30, GETDATE()), DATEADD(day, 30, GETDATE()), 100, 15, GETDATE(), GETDATE()),
    (N'FASHION20', N'fixed', 20000.0000, DATEADD(day, -30, GETDATE()), DATEADD(day, 30, GETDATE()), 50, 8, GETDATE(), GETDATE());
GO

-- =============================================
-- INVENTORY TRANSACTIONS
-- =============================================
INSERT INTO inventory_transactions (variant_id, qty_change, reason, order_id, created_at, updated_at)
VALUES 
    -- Initial stock for Product 1 variants
    (1, 50, N'Nhập kho đầu kỳ', NULL, DATEADD(day, -30, GETDATE()), DATEADD(day, -30, GETDATE())),
    (2, 45, N'Nhập kho đầu kỳ', NULL, DATEADD(day, -30, GETDATE()), DATEADD(day, -30, GETDATE())),
    (3, 40, N'Nhập kho đầu kỳ', NULL, DATEADD(day, -30, GETDATE()), DATEADD(day, -30, GETDATE())),
    
    -- Sales from Order 1
    (1, -2, N'Bán hàng - Đơn hàng ORD-20260129-001', 1, DATEADD(day, -10, GETDATE()), DATEADD(day, -10, GETDATE())),
    (10, -1, N'Bán hàng - Đơn hàng ORD-20260129-001', 1, DATEADD(day, -10, GETDATE()), DATEADD(day, -10, GETDATE())),
    
    -- Sales from Order 2
    (20, -1, N'Bán hàng - Đơn hàng ORD-20260129-002', 2, DATEADD(day, -3, GETDATE()), DATEADD(day, -3, GETDATE())),
    
    -- Sales from Order 3
    (11, -1, N'Bán hàng - Đơn hàng ORD-20260129-003', 3, GETDATE(), GETDATE());
GO

PRINT 'Seed data inserted successfully!';
PRINT 'Summary:';
PRINT '  - 3 users (1 admin, 2 customers)';
PRINT '  - 6 categories (3 parent, 3 child)';
PRINT '  - 4 products with variants';
PRINT '  - 34 product variants (9 + 12 + 9 + 9)';
PRINT '  - 12 product images';
PRINT '  - 2 carts with items';
PRINT '  - 3 orders with items';
PRINT '  - 3 product reviews';
PRINT '  - 4 wishlist entries';
PRINT '  - 2 coupons';
PRINT '  - 11 inventory transactions';
GO
