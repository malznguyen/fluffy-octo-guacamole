-- Add Wishlist table
-- Run this script to create the wishlist table

USE fashon_db;
GO

-- Create wishlists table
CREATE TABLE wishlists (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT uk_wishlist_user_product UNIQUE (user_id, product_id)
);

-- Create index for faster queries
CREATE INDEX idx_wishlist_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlists(product_id);
GO

PRINT 'Wishlist table created successfully!';
GO
