-- =============================================
-- FASH.ON PRODUCT CATALOG TABLES
-- Phase 3: Product Catalog Module
-- =============================================

USE fashon_db;
GO

-- =============================================
-- CATEGORIES TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'categories')
BEGIN
    CREATE TABLE categories (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        slug NVARCHAR(255) NOT NULL UNIQUE,
        description NVARCHAR(1000),
        parent_id BIGINT NULL,
        sort_order INT DEFAULT 0,
        is_active BIT DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id)
    );

    CREATE INDEX idx_categories_slug ON categories(slug);
    CREATE INDEX idx_categories_parent ON categories(parent_id);
    CREATE INDEX idx_categories_active ON categories(is_active);
    CREATE INDEX idx_categories_deleted_at ON categories(deleted_at);
END
GO

-- =============================================
-- PRODUCTS TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'products')
BEGIN
    CREATE TABLE products (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(500) NOT NULL,
        slug NVARCHAR(500) NOT NULL UNIQUE,
        description NVARCHAR(MAX),
        base_price DECIMAL(19,4) NOT NULL,
        category_id BIGINT NOT NULL,
        is_visible BIT DEFAULT 1,
        sold_count BIGINT DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE INDEX idx_products_slug ON products(slug);
    CREATE INDEX idx_products_category ON products(category_id);
    CREATE INDEX idx_products_visible ON products(is_visible);
    CREATE INDEX idx_products_deleted_at ON products(deleted_at);
    CREATE INDEX idx_products_price ON products(base_price);
    CREATE INDEX idx_products_sold_count ON products(sold_count);
END
GO

-- =============================================
-- PRODUCT_VARIANTS TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'product_variants')
BEGIN
    CREATE TABLE product_variants (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        product_id BIGINT NOT NULL,
        sku NVARCHAR(100) NOT NULL UNIQUE,
        color NVARCHAR(50),
        size NVARCHAR(20),
        stock_quantity INT NOT NULL DEFAULT 0,
        price_adjustment DECIMAL(19,4) DEFAULT 0,
        is_available BIT DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE INDEX idx_variants_product ON product_variants(product_id);
    CREATE INDEX idx_variants_sku ON product_variants(sku);
    CREATE INDEX idx_variants_available ON product_variants(is_available);
    CREATE INDEX idx_variants_deleted_at ON product_variants(deleted_at);
END
GO

-- =============================================
-- PRODUCT_IMAGES TABLE
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'product_images')
BEGIN
    CREATE TABLE product_images (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        product_id BIGINT NOT NULL,
        image_url NVARCHAR(1000) NOT NULL,
        alt_text NVARCHAR(255),
        sort_order INT NOT NULL DEFAULT 0,
        is_primary BIT DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        deleted_at DATETIME2 NULL,
        CONSTRAINT fk_images_product FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE INDEX idx_images_product ON product_images(product_id);
    CREATE INDEX idx_images_primary ON product_images(is_primary);
    CREATE INDEX idx_images_sort_order ON product_images(sort_order);
    CREATE INDEX idx_images_deleted_at ON product_images(deleted_at);
END
GO

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample categories
IF NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'thoi-trang-nam')
BEGIN
    INSERT INTO categories (name, slug, description, sort_order, is_active)
    VALUES 
        (N'Thoi trang nam', 'thoi-trang-nam', N'Danh muc thoi trang nam', 1, 1),
        (N'Thoi trang nu', 'thoi-trang-nu', N'Danh muc thoi trang nu', 2, 1),
        (N'Phu kien', 'phu-kien', N'Danh muc phu kien thoi trang', 3, 1);

    -- Insert sub-categories
    DECLARE @namId BIGINT = (SELECT id FROM categories WHERE slug = 'thoi-trang-nam');
    DECLARE @nuId BIGINT = (SELECT id FROM categories WHERE slug = 'thoi-trang-nu');

    INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
    VALUES 
        (N'Ao nam', 'ao-nam', N'Ao thun, ao so mi nam', @namId, 1, 1),
        (N'Quan nam', 'quan-nam', N'Quan jean, quan kaki nam', @namId, 2, 1),
        (N'Ao nu', 'ao-nu', N'Ao thun, ao so mi nu', @nuId, 1, 1),
        (N'Quan nu', 'quan-nu', N'Quan jean, quan short nu', @nuId, 2, 1);
END
GO

PRINT 'Product catalog tables created successfully!';
GO
