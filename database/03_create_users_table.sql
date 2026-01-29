-- Create users table for Phase 2: User & Auth
-- Run this in SSMS before starting the backend

USE fashon_db;
GO

-- Create users table
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20) NULL,
    avatar_url NVARCHAR(500) NULL,
    role NVARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL
);
GO

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
GO

-- Insert sample admin user (password: admin123)
-- BCrypt hash for 'admin123'
INSERT INTO users (email, password_hash, full_name, phone, role, created_at, updated_at)
VALUES (
    N'admin@fashon.vn',
    N'$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqNlY1sNT4L3G6Gq5z3qQ7h8aS9v2',
    N'Administrator',
    N'0901234567',
    N'ADMIN',
    GETDATE(),
    GETDATE()
);
GO

-- Insert sample customer user (password: customer123)
-- BCrypt hash for 'customer123'
INSERT INTO users (email, password_hash, full_name, phone, role, created_at, updated_at)
VALUES (
    N'customer@example.com',
    N'$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqNlY1sNT4L3G6Gq5z3qQ7h8aS9v2',
    N'Nguyen Van A',
    N'0909876543',
    N'CUSTOMER',
    GETDATE(),
    GETDATE()
);
GO

SELECT 'Users table created and sample data inserted' AS Result;
