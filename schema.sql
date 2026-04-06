-- ============================================================
-- PakSolarTech - Full DB Reset & Schema
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables to start fresh
DROP TABLE IF EXISTS views;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS vendors;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS inquiries;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. Roles
-- ============================================================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES ('super_admin'), ('admin'), ('vendor'), ('customer');

-- ============================================================
-- 2. Users
-- ============================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL DEFAULT 4,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ============================================================
-- 3. Admins (legacy admin model support)
-- ============================================================
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. Vendors
-- ============================================================
CREATE TABLE vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    business_name VARCHAR(150) NOT NULL,
    logo_url VARCHAR(255),
    description TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 5. Categories
-- ============================================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT
);

-- ============================================================
-- 6. Products
-- ============================================================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description LONGTEXT,
    short_desc VARCHAR(255),
    category_id INT,
    image_url VARCHAR(255),
    images JSON,
    status ENUM('active', 'inactive') DEFAULT 'active',
    badge VARCHAR(50),
    price_from DECIMAL(10,2),
    price_to DECIMAL(10,2),
    is_featured BOOLEAN DEFAULT FALSE,
    wattage INT,
    brand VARCHAR(100),
    specs JSON,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ============================================================
-- 7. Offers (vendor-specific pricing/stock)
-- ============================================================
CREATE TABLE offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    vendor_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    expiry_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- ============================================================
-- 8. Orders
-- ============================================================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- ============================================================
-- 9. Order Items
-- ============================================================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    offer_id INT NOT NULL,
    vendor_id INT NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'refunded') DEFAULT 'pending',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES offers(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- ============================================================
-- 10. Blogs
-- ============================================================
CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT,
    cover_image VARCHAR(255),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 11. Inquiries
-- ============================================================
CREATE TABLE inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 12. Activity Logs
-- ============================================================
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 13. Views (Analytics)
-- ============================================================
CREATE TABLE views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type ENUM('page', 'product') NOT NULL,
    entity_id INT,
    viewer_id INT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (viewer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- Seed: Super Admin User
-- Password: Admin@123 (bcrypt hash, cost=12)
-- ============================================================
INSERT INTO users (name, email, password_hash, role_id, is_active)
VALUES (
    'Super Admin',
    'admin@paksolartech.com',
    '$2b$12$nE.kvH/NxRJgF9azihAGVuULAI0wuUBTr/mXPf.vazI3Amzgum3Vq',
    1,
    TRUE
);
