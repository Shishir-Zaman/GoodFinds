-- GoodFinds Database - Complete Setup with Data
-- Import this file in phpMyAdmin to set up the entire database

-- Drop and recreate database
DROP DATABASE IF EXISTS goodfinds;
CREATE DATABASE goodfinds;
USE goodfinds;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('buyer', 'seller', 'admin') DEFAULT 'buyer',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    condition_status ENUM('new', 'like_new', 'good', 'fair', 'poor') DEFAULT 'good',
    image_url TEXT,
    is_authentic BOOLEAN DEFAULT FALSE,
    purchase_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    buyer_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Users (Password: password123 for all)
INSERT INTO users (name, email, password, role, is_verified) VALUES
('System Administrator', 'admin@goodfinds.com', '$2a$10$rZ5YxZ5YxZ5YxZ5YxZ5YxOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'admin', TRUE),
('Aarong', 'aarong@example.com', '$2a$10$rZ5YxZ5YxZ5YxZ5YxZ5YxOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'seller', TRUE),
('RFL', 'rfl@example.com', '$2a$10$rZ5YxZ5YxZ5YxZ5YxZ5YxOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'seller', TRUE),
('Singer', 'singer@example.com', '$2a$10$rZ5YxZ5YxZ5YxZ5YxZ5YxOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'seller', TRUE),
('Walton', 'walton@example.com', '$2a$10$rZ5YxZ5YxZ5YxZ5YxZ5YxOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'seller', TRUE),
('Yamaha', 'yamaha@example.com', '$2a$10$rZ5YxZ5YxZ5YxZ5YxZ5YxOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'seller', TRUE),
('BookWorm BD', 'bookworm@example.com', '$2a$10$rZ5YxZ5YxZ5YxZ5YxZ5YxOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'seller', FALSE),
('RetroFinds BD', 'retrofinds@example.com', '$2a$10$rZ5YxZ5YxZ5YxZ5YxZ5YxOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'seller', FALSE),
('ToyZone BD', 'toyzone@example.com', '$2a$10$rZ5YxZ5YxZ5YxZ5YxZ5YxOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'seller', FALSE),
('John Doe', 'john@example.com', '$2a$10$rZ5YxZ5YxZ5YxZ5YxZ5YxOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'buyer', FALSE);

-- Insert Categories
INSERT INTO categories (id, name, image_url) VALUES
(1, 'Electronics', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'),
(2, 'Clothing', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'),
(3, 'Furniture', 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'),
(4, 'Toys', 'https://images.pexels.com/photos/1634449/pexels-photo-1634449.jpeg'),
(5, 'Books', 'https://images.pexels.com/photos/1301585/pexels-photo-1301585.jpeg'),
(6, 'Sports', 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg');

-- Insert Sample Products
INSERT INTO products (seller_id, category_id, name, description, price, condition_status, image_url, is_authentic, purchase_date, created_at) VALUES
-- Walton Electronics
(5, 1, 'Walton Refrigerator', 'Energy-efficient refrigerator with 10-year compressor warranty', 35000.00, 'like_new', 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg', TRUE, '2023-01-15', '2024-11-15 10:00:00'),
(5, 1, 'Walton LED TV 43 inch', 'Smart TV with Android OS and built-in apps', 28000.00, 'new', 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg', TRUE, '2024-06-01', '2024-11-16 11:00:00'),

-- Singer Electronics
(4, 1, 'Singer Iron Box', 'Automatic steam iron with non-stick soleplate', 2500.00, 'good', 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg', TRUE, '2022-03-10', '2024-11-10 09:00:00'),
(4, 1, 'Singer Sewing Machine', 'Electric sewing machine with 20 stitch patterns', 15000.00, 'like_new', 'https://images.pexels.com/photos/3738386/pexels-photo-3738386.jpeg', TRUE, '2023-05-20', '2024-11-12 14:00:00'),

-- Aarong Clothing
(2, 2, 'Aarong Cotton Saree', 'Handwoven cotton saree with traditional Bengali design', 4500.00, 'new', 'https://images.pexels.com/photos/8148577/pexels-photo-8148577.jpeg', TRUE, '2024-09-01', '2024-11-17 10:00:00'),
(2, 2, 'Aarong Punjabi', 'Premium cotton punjabi for men', 3200.00, 'new', 'https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg', TRUE, '2024-10-15', '2024-11-18 12:00:00'),

-- RFL Furniture
(3, 3, 'RFL Plastic Chair', 'Durable plastic chair for indoor and outdoor use', 850.00, 'new', 'https://images.pexels.com/photos/116910/pexels-photo-116910.jpeg', TRUE, '2024-08-01', '2024-11-14 13:00:00'),
(3, 3, 'RFL Dining Table', 'Modern dining table with 6 chairs', 25000.00, 'like_new', 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg', TRUE, '2023-02-10', '2024-11-13 15:00:00'),

-- ToyZone Toys
(9, 4, 'LEGO City Building Set', 'Complete building set with 500+ pieces', 4500.00, 'new', 'https://images.pexels.com/photos/1634449/pexels-photo-1634449.jpeg', TRUE, '2024-10-01', '2024-11-19 09:00:00'),
(9, 4, 'Remote Control Car', 'High-speed RC car with rechargeable battery', 3200.00, 'like_new', 'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg', TRUE, '2024-07-15', '2024-11-19 10:00:00'),
(9, 4, 'Barbie Doll Collection', 'Set of 3 Barbie dolls with accessories', 2800.00, 'new', 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg', TRUE, '2024-09-20', '2024-11-19 11:00:00'),

-- BookWorm Books
(7, 5, 'Atomic Habits', 'Bestselling self-help book by James Clear', 450.00, 'like_new', 'https://images.pexels.com/photos/1301585/pexels-photo-1301585.jpeg', FALSE, '2023-06-10', '2024-11-11 16:00:00'),
(7, 5, 'The Alchemist', 'Classic novel by Paulo Coelho', 350.00, 'good', 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg', FALSE, '2022-04-15', '2024-11-11 17:00:00'),

-- Yamaha Sports
(6, 6, 'Yamaha Cricket Bat', 'Professional cricket bat made from Kashmir willow', 3500.00, 'like_new', 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg', TRUE, '2023-08-01', '2024-11-15 11:00:00'),
(6, 6, 'Yamaha Football', 'Official size 5 football for professional play', 1200.00, 'new', 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg', TRUE, '2024-05-10', '2024-11-16 13:00:00'),

-- RetroFinds Vintage Items
(8, 1, 'Vintage Cassette Player', 'Working cassette player from the 1990s', 2500.00, 'good', 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg', FALSE, '2020-01-01', '2024-11-10 12:00:00');

-- Create indexes for better performance
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_created ON products(created_at);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
