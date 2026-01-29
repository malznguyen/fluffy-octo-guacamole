-- =============================================
-- FASH.ON REBORN - DATABASE INITIALIZATION
-- Created: 2026-01-29
-- Tech: SQL Server 2022
-- =============================================

-- Create database with Vietnamese UTF-8 collation
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'fashon_db')
BEGIN
    CREATE DATABASE fashon_db
    COLLATE Vietnamese_100_CI_AS_SC_UTF8;
END
GO

USE fashon_db;
GO

-- =============================================
-- TABLE: users
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(100) NOT NULL,
        phone NVARCHAR(20),
        role NVARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        INDEX idx_users_email (email),
        INDEX idx_users_role (role),
        INDEX idx_users_deleted (deleted_at)
    );
END
GO

-- =============================================
-- TABLE: categories (self-referencing)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'categories')
BEGIN
    CREATE TABLE categories (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        slug NVARCHAR(100) NOT NULL UNIQUE,
        description NVARCHAR(500),
        parent_id INT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        INDEX idx_categories_slug (slug),
        INDEX idx_categories_parent (parent_id),
        INDEX idx_categories_deleted (deleted_at)
    );
END
GO

-- Add self-referencing FK after table creation
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_categories_parent')
BEGIN
    ALTER TABLE categories
    ADD CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) 
        REFERENCES categories(id) ON DELETE NO ACTION;
END
GO

-- =============================================
-- TABLE: products
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'products')
BEGIN
    CREATE TABLE products (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(200) NOT NULL,
        slug NVARCHAR(200) NOT NULL UNIQUE,
        description NVARCHAR(MAX),
        base_price DECIMAL(19,4) NOT NULL,
        category_id INT NOT NULL,
        status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        INDEX idx_products_slug (slug),
        INDEX idx_products_category (category_id),
        INDEX idx_products_status (status),
        INDEX idx_products_deleted (deleted_at)
    );
END
GO

-- Add FK after table creation
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_products_category')
BEGIN
    ALTER TABLE products
    ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) 
        REFERENCES categories(id) ON DELETE NO ACTION;
END
GO

-- =============================================
-- TABLE: product_variants
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'product_variants')
BEGIN
    CREATE TABLE product_variants (
        id INT IDENTITY(1,1) PRIMARY KEY,
        product_id INT NOT NULL,
        color NVARCHAR(50) NOT NULL,
        size NVARCHAR(20) NOT NULL,
        sku NVARCHAR(50) NOT NULL UNIQUE,
        stock_qty INT NOT NULL DEFAULT 0,
        price_adjustment DECIMAL(19,4) NOT NULL DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        INDEX idx_variants_product (product_id),
        INDEX idx_variants_sku (sku),
        INDEX idx_variants_deleted (deleted_at)
    );
END
GO

-- Add FK after table creation
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_variants_product')
BEGIN
    ALTER TABLE product_variants
    ADD CONSTRAINT fk_variants_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE;
END
GO

-- =============================================
-- TABLE: product_images
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'product_images')
BEGIN
    CREATE TABLE product_images (
        id INT IDENTITY(1,1) PRIMARY KEY,
        product_id INT NOT NULL,
        file_path NVARCHAR(500) NOT NULL,
        alt_text NVARCHAR(200),
        sort_order INT NOT NULL DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        INDEX idx_images_product (product_id),
        INDEX idx_images_sort (sort_order),
        INDEX idx_images_deleted (deleted_at)
    );
END
GO

-- Add FK after table creation
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_images_product')
BEGIN
    ALTER TABLE product_images
    ADD CONSTRAINT fk_images_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE;
END
GO

-- =============================================
-- TABLE: carts (1-1 with users)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'carts')
BEGIN
    CREATE TABLE carts (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        INDEX idx_carts_user (user_id),
        INDEX idx_carts_deleted (deleted_at)
    );
END
GO

-- Add FK after table creation
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_carts_user')
BEGIN
    ALTER TABLE carts
    ADD CONSTRAINT fk_carts_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE;
END
GO

-- =============================================
-- TABLE: cart_items
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cart_items')
BEGIN
    CREATE TABLE cart_items (
        id INT IDENTITY(1,1) PRIMARY KEY,
        cart_id INT NOT NULL,
        variant_id INT NOT NULL,
        qty INT NOT NULL CHECK (qty > 0),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        INDEX idx_cart_items_cart (cart_id),
        INDEX idx_cart_items_variant (variant_id),
        INDEX idx_cart_items_deleted (deleted_at)
    );
END
GO

-- Add FKs after table creation
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_cart_items_cart')
BEGIN
    ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) 
        REFERENCES carts(id) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_cart_items_variant')
BEGIN
    ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_variant FOREIGN KEY (variant_id) 
        REFERENCES product_variants(id) ON DELETE CASCADE;
END
GO

-- =============================================
-- TABLE: orders
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'orders')
BEGIN
    CREATE TABLE orders (
        id INT IDENTITY(1,1) PRIMARY KEY,
        order_code NVARCHAR(50) NOT NULL UNIQUE,
        user_id INT NOT NULL,
        total DECIMAL(19,4) NOT NULL,
        status NVARCHAR(30) NOT NULL DEFAULT 'pending' 
            CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
        shipping_address NVARCHAR(500) NOT NULL,
        phone NVARCHAR(20) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        INDEX idx_orders_code (order_code),
        INDEX idx_orders_user (user_id),
        INDEX idx_orders_status (status),
        INDEX idx_orders_deleted (deleted_at)
    );
END
GO

-- Add FK after table creation
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_orders_user')
BEGIN
    ALTER TABLE orders
    ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE NO ACTION;
END
GO

-- =============================================
-- TABLE: order_items
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'order_items')
BEGIN
    CREATE TABLE order_items (
        id INT IDENTITY(1,1) PRIMARY KEY,
        order_id INT NOT NULL,
        product_name_snapshot NVARCHAR(200) NOT NULL,
        variant_info_snapshot NVARCHAR(100) NOT NULL,
        qty INT NOT NULL CHECK (qty > 0),
        unit_price DECIMAL(19,4) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        INDEX idx_order_items_order (order_id),
        INDEX idx_order_items_deleted (deleted_at)
    );
END
GO

-- Add FK after table creation
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_order_items_order')
BEGIN
    ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) 
        REFERENCES orders(id) ON DELETE CASCADE;
END
GO

-- =============================================
-- TABLE: product_reviews
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'product_reviews')
BEGIN
    CREATE TABLE product_reviews (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        content NVARCHAR(1000),
        is_verified_purchase BIT NOT NULL DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        -- Unique constraint: one review per user per product (when not soft deleted)
        CONSTRAINT uq_user_product_review UNIQUE (user_id, product_id),
        
        INDEX idx_reviews_product (product_id),
        INDEX idx_reviews_rating (rating),
        INDEX idx_reviews_deleted (deleted_at)
    );
END
GO

-- Add FKs after table creation
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_reviews_user')
BEGIN
    ALTER TABLE product_reviews
    ADD CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_reviews_product')
BEGIN
    ALTER TABLE product_reviews
    ADD CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE;
END
GO

-- =============================================
-- TABLE: wishlists
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'wishlists')
BEGIN
    CREATE TABLE wishlists (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        -- Unique constraint: one wishlist entry per user per product
        CONSTRAINT uq_user_product_wishlist UNIQUE (user_id, product_id),
        
        INDEX idx_wishlists_user (user_id),
        INDEX idx_wishlists_product (product_id),
        INDEX idx_wishlists_deleted (deleted_at)
    );
END
GO

-- Add FKs after table creation
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_wishlists_user')
BEGIN
    ALTER TABLE wishlists
    ADD CONSTRAINT fk_wishlists_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_wishlists_product')
BEGIN
    ALTER TABLE wishlists
    ADD CONSTRAINT fk_wishlists_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE;
END
GO

-- =============================================
-- TABLE: coupons
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'coupons')
BEGIN
    CREATE TABLE coupons (
        id INT IDENTITY(1,1) PRIMARY KEY,
        code NVARCHAR(50) NOT NULL UNIQUE,
        type NVARCHAR(20) NOT NULL CHECK (type IN ('percent', 'fixed')),
        value DECIMAL(19,4) NOT NULL,
        start_date DATETIME2 NOT NULL,
        end_date DATETIME2 NOT NULL,
        max_usage INT NOT NULL,
        used_count INT NOT NULL DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        INDEX idx_coupons_code (code),
        INDEX idx_coupons_dates (start_date, end_date),
        INDEX idx_coupons_deleted (deleted_at)
    );
END
GO

-- =============================================
-- TABLE: inventory_transactions
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'inventory_transactions')
BEGIN
    CREATE TABLE inventory_transactions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        variant_id INT NOT NULL,
        qty_change INT NOT NULL,
        reason NVARCHAR(200) NOT NULL,
        order_id INT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        
        INDEX idx_inventory_variant (variant_id),
        INDEX idx_inventory_order (order_id),
        INDEX idx_inventory_deleted (deleted_at)
    );
END
GO

-- Add FKs after table creation
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_inventory_variant')
BEGIN
    ALTER TABLE inventory_transactions
    ADD CONSTRAINT fk_inventory_variant FOREIGN KEY (variant_id) 
        REFERENCES product_variants(id) ON DELETE NO ACTION;
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'fk_inventory_order')
BEGIN
    ALTER TABLE inventory_transactions
    ADD CONSTRAINT fk_inventory_order FOREIGN KEY (order_id) 
        REFERENCES orders(id) ON DELETE SET NULL;
END
GO

PRINT 'Database initialization completed successfully!';
PRINT 'Total tables created: 13';
GO
