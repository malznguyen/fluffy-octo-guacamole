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
    (N'admin@fashon.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzFRCJ1BX9P4Q.FG3vH7X.Lm3M2', N'Quản Trị Viên', N'0909123456', 'ADMIN', GETDATE(), GETDATE()),
    (N'nguyenvana@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzFRCJ1BX9P4Q.FG3vH7X.Lm3M2', N'Nguyễn Văn A', N'0912345678', 'CUSTOMER', GETDATE(), GETDATE()),
    (N'tranthib@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzFRCJ1BX9P4Q.FG3vH7X.Lm3M2', N'Trần Thị B', N'0987654321', 'CUSTOMER', GETDATE(), GETDATE());
GO
