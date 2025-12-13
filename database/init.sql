-- Create Database
CREATE DATABASE IF NOT EXISTS goodfinds;
USE goodfinds;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('buyer', 'seller', 'admin') DEFAULT 'buyer',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    image_url VARCHAR(255)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL, -- Stored in BDT
    condition_status ENUM('new', 'like_new', 'good', 'fair') NOT NULL,
    purchase_date DATE,
    image_url VARCHAR(255),
    is_authentic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert Default Categories
INSERT IGNORE INTO categories (name, image_url) VALUES 
('Electronics', 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&w=400&q=80'),
('Clothing', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80'),
('Furniture', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'),
('Toys', 'https://images.unsplash.com/photo-1566576912902-4b6106819423?auto=format&fit=crop&w=400&q=80'),
('Books', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80'),
('Sports', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80');

-- Insert Mock Users (Password: password123 - hashed)
INSERT IGNORE INTO users (id, name, email, password, role, is_verified) VALUES 
(1, 'TechTraders Ltd.', 'seller@example.com', '$2b$10$/rgnt13ERhyjvG0W00mnSO8/sL4L6BXkEiD37Y7TIIzbDEQQFroLk2', 'seller', TRUE),
(2, 'System Administrator', 'admin@example.com', '$2b$10$/rgnt13ERhyjvG0W00mnSO8/sL4L6BXkEiD37Y7TIIzbDEQQFroLk2', 'admin', TRUE);

-- Insert Mock Products (Sample Data matching Seed Script)
INSERT IGNORE INTO products (seller_id, category_id, name, description, price, condition_status, image_url, is_authentic, purchase_date, created_at) VALUES 
(1, 1, 'iPhone 13 Pro', 'Graphite iPhone 13 Pro. 128GB. Pristine condition with original box and cable.', 75000.00, 'like_new', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80', TRUE, DATE_SUB(NOW(), INTERVAL 6 MONTH), NOW()),
(1, 1, 'Sony Walkman', 'Vintage Sony Walkman cassette player. Fully functional collector item.', 5000.00, 'good', 'https://images.unsplash.com/photo-1601525955303-7735b2f2225d?auto=format&fit=crop&w=800&q=80', TRUE, DATE_SUB(NOW(), INTERVAL 5 YEAR), NOW()),
(1, 1, 'Samsung Galaxy S10', 'Prism White Galaxy S10. Minor scratches on bezel. Screen perfect.', 20000.00, 'fair', 'https://images.unsplash.com/photo-1561212044-bac5ef688a07?auto=format&fit=crop&w=800&q=80', FALSE, DATE_SUB(NOW(), INTERVAL 2 YEAR), NOW()),

(1, 2, 'Zara Summer Dress', 'White floral summer dress. Size M. Never worn, tags attached.', 1500.00, 'new', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80', TRUE, DATE_SUB(NOW(), INTERVAL 1 MONTH), NOW()),
(1, 2, 'Levis 501 90s Jeans', 'Classic 90s vintage Levis 501. Light wash. Size 32x32.', 3000.00, 'good', 'https://images.unsplash.com/photo-1542272617-08f08630793c?auto=format&fit=crop&w=800&q=80', TRUE, DATE_SUB(NOW(), INTERVAL 4 YEAR), NOW()),
(1, 2, 'North Face Puffer', 'Black North Face Nuptse jacket. Very warm, excellent condition.', 5000.00, 'like_new', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', TRUE, DATE_SUB(NOW(), INTERVAL 2 YEAR), NOW()),

(1, 3, 'Minimalist Desk', 'White minimalist desk with oak legs. Perfect for home office.', 4000.00, 'good', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80', FALSE, DATE_SUB(NOW(), INTERVAL 2 YEAR), NOW()),
(1, 3, 'Antique Chair', 'Hand-carved wooden chair from the 1950s. Needs reupholstery.', 8000.00, 'fair', 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80', TRUE, DATE_SUB(NOW(), INTERVAL 10 YEAR), NOW()),
(1, 3, 'Lounge Bean Bag', 'Grey oversized bean bag. Extremely comfortable.', 1200.00, 'like_new', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=800&q=80', FALSE, DATE_SUB(NOW(), INTERVAL 3 MONTH), NOW()),

(1, 4, 'Hot Wheels Set', 'Mixed collection of 20 Hot Wheels cars. Various models.', 2000.00, 'good', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80', FALSE, DATE_SUB(NOW(), INTERVAL 2 YEAR), NOW()),
(1, 4, 'Vintage Barbie', '1980s Barbie doll in original packaging. Rare find.', 10000.00, 'like_new', 'https://images.unsplash.com/photo-1560859259-78f7c28d4636?auto=format&fit=crop&w=800&q=80', TRUE, DATE_SUB(NOW(), INTERVAL 5 YEAR), NOW()),
(1, 4, 'PS5 Controller', 'Brand new DualSense controller. White.', 5000.00, 'new', 'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?auto=format&fit=crop&w=800&q=80', TRUE, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),

(1, 5, 'Harry Potter 1st Ed', 'Harry Potter and the Philosophers Stone. First Edition.', 15000.00, 'good', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80', TRUE, DATE_SUB(NOW(), INTERVAL 10 YEAR), NOW()),
(1, 5, 'Atomic Habits', 'Hardcover copy of Atomic Habits. Read once.', 500.00, 'like_new', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80', FALSE, DATE_SUB(NOW(), INTERVAL 2 MONTH), NOW()),
(1, 5, 'GOT Box Set', 'Complete Game of Thrones paperback set. Good condition.', 2500.00, 'good', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80', FALSE, DATE_SUB(NOW(), INTERVAL 2 YEAR), NOW()),

(1, 6, 'Signed Cricket Bat', 'Cricket bat signed by national team captain.', 12000.00, 'good', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80', TRUE, DATE_SUB(NOW(), INTERVAL 3 YEAR), NOW()),
(1, 6, 'Yoga Mat', 'Premium non-slip yoga mat. Purple.', 800.00, 'new', 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80', FALSE, DATE_SUB(NOW(), INTERVAL 1 WEEK), NOW()),
(1, 6, 'Wooden Tennis Racket', 'Vintage wooden tennis racket. Great for display.', 4000.00, 'fair', 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?auto=format&fit=crop&w=800&q=80', FALSE, DATE_SUB(NOW(), INTERVAL 15 YEAR), NOW());
