const db = require('./config/db');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const seedCloud = async () => {
    try {
        const conn = await mysql.createConnection(process.env.DATABASE_URL || {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
        });

        console.log('🔌 Connected to database. Clearing old data...');
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');
        await conn.query('TRUNCATE TABLE reviews');
        await conn.query('TRUNCATE TABLE order_items');
        await conn.query('TRUNCATE TABLE orders');
        await conn.query('TRUNCATE TABLE products');
        await conn.query('TRUNCATE TABLE categories');
        await conn.query('TRUNCATE TABLE users');
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('🌱 Seeding Users...');
        const users = [
            [20, 'Aarong', 'aarong@example.com', '$2b$10$R4nK1j5f9ChcutZ4kSLnh.TIgS1/H1R/ksPKeLE2wXwRIkE7PlJTu', 'seller', 1],
            [21, 'RFL', 'rfl@example.com', '$2b$10$R4nK1j5f9ChcutZ4kSLnh.TIgS1/H1R/ksPKeLE2wXwRIkE7PlJTu', 'seller', 1],
            [22, 'Singer', 'singer@example.com', '$2b$10$R4nK1j5f9ChcutZ4kSLnh.TIgS1/H1R/ksPKeLE2wXwRIkE7PlJTu', 'seller', 1],
            [23, 'Walton', 'walton@example.com', '$2b$10$R4nK1j5f9ChcutZ4kSLnh.TIgS1/H1R/ksPKeLE2wXwRIkE7PlJTu', 'seller', 1],
            [24, 'Yamaha', 'yamaha@example.com', '$2b$10$R4nK1j5f9ChcutZ4kSLnh.TIgS1/H1R/ksPKeLE2wXwRIkE7PlJTu', 'seller', 1],
            [25, 'BookWorm BD', 'bookworm@example.com', '$2b$10$R4nK1j5f9ChcutZ4kSLnh.TIgS1/H1R/ksPKeLE2wXwRIkE7PlJTu', 'seller', 0],
            [26, 'RetroFinds BD', 'retrofinds@example.com', '$2b$10$R4nK1j5f9ChcutZ4kSLnh.TIgS1/H1R/ksPKeLE2wXwRIkE7PlJTu', 'seller', 0],
            [27, 'ToyZone BD', 'toyzone@example.com', '$2b$10$R4nK1j5f9ChcutZ4kSLnh.TIgS1/H1R/ksPKeLE2wXwRIkE7PlJTu', 'seller', 0],
            [28, 'System Administrator', 'admin@example.com', '$2b$10$R4nK1j5f9ChcutZ4kSLnh.TIgS1/H1R/ksPKeLE2wXwRIkE7PlJTu', 'admin', 1],
            [29, 'Shishir', 'shishir_buyer@example.com', '$2b$10$7SjBOxc6f.AnNypAsi94L.TozfAnxXWWeQrbUPCPD/KUnjrATQ212', 'buyer', 1]
        ];
        await conn.query('INSERT INTO users (id, name, email, password, role, is_verified) VALUES ?', [users]);

        console.log('🌱 Seeding Categories...');
        const categories = [
            [13, 'Electronics', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400'],
            [14, 'Clothing', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'],
            [15, 'Furniture', 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400'],
            [16, 'Toys', 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400'],
            [17, 'Books', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'],
            [18, 'Sports', 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400']
        ];
        await conn.query('INSERT INTO categories (id, name, image_url) VALUES ?', [categories]);

        console.log('🌱 Seeding Products...');
        const products = [
            [39, 23, 13, 'Walton Mouse', 'Gaming Mouse for all. 4k Polling rate', 200.00, 'good', 'https://t3.ftcdn.net/jpg/00/71/26/14/360_F_71261489_mRyJQAyVI8cuXxIRqS1J6ApFYfhV6Lbi.jpg', 1, '2022-01-01'],
            [40, 23, 13, 'Walton Refrigerator', 'Energy-efficient refrigerator. 200L capacity, perfect for families.', 28000.00, 'like_new', 'https://beemart.com.bd/images/products/1706103589.jpg', 1, '2023-01-01'],
            [41, 20, 14, 'Aarong Cotton Saree', 'Beautiful handwoven cotton saree. Traditional Bangladeshi design.', 3500.00, 'new', 'https://mcprod.aarong.com/media/catalog/product/0/5/0560000079901_1.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=', 1, '2025-05-31'],
            [42, 20, 14, 'Aarong Punjabi (Men)', 'Premium cotton punjabi. Size L. Perfect for festivals.', 2200.00, 'like_new', 'https://mcprod.aarong.com//media/catalog/product/1/2/1200000034317_1.jpg', 1, '2024-01-01'],
            [43, 21, 15, 'RFL Plastic Chair Set', 'Set of 4 durable plastic chairs. Weather-resistant.', 4500.00, 'like_new', 'https://www.rflhouseware.com/uploads/thumbnails/1612610214.png', 1, '2023-02-23'],
            [44, 21, 15, 'RFL Study Table', 'Compact study table with drawer. Perfect for students.', 5500.00, 'new', 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg', 1, '2025-01-30'],
            [45, 24, 18, 'Yamaha Acoustic Guitar', 'Professional acoustic guitar. Great sound quality.', 12000.00, 'like_new', 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg', 1, '2023-10-06'],
            [46, 24, 13, 'Yamaha Keyboard PSR-F51', 'Beginner-friendly keyboard with 61 keys.', 85000.00, 'like_new', 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg', 1, '2023-01-01'],
            [47, 22, 13, 'Singer Sewing Machine', 'Classic Singer sewing machine. Perfect for home use.', 15000.00, 'good', 'https://i5.walmartimages.com/seo/Singer-Portable-Sewing-Machine-with-LED-Lighting-and-Accessories-White_a4be8884-c285-45c1-9533-4869972475cd.d0e244377c9a402e1b2c597d5da7bd72.jpeg', 1, '2012-11-25'],
            [48, 22, 13, 'Singer Iron', 'Steam iron with non-stick plate. Works perfectly.', 1800.00, 'like_new', 'https://singerwebcdn.azureedge.net/resources/products/normal/SIS-ATC-508-01.webp', 1, '2023-08-20'],
            [49, 25, 17, 'Harry Potter Complete Set', 'All 7 books in good condition. Perfect for HP fans!', 3500.00, 'like_new', 'https://www.books2door.com/cdn/shop/files/thumbnail_b029604d-794c-4f32-adbe-7b2432b983db.jpg?v=1740403273', 0, '2024-06-23'],
            [50, 25, 17, 'Programming Books Bundle', '5 programming books including Python and JavaScript guides.', 2200.00, 'like_new', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg', 0, '2023-04-04'],
            [52, 26, 13, 'Vintage Cassette Player', 'Classic 1990s cassette player. Still works! Great for collectors.', 4500.00, 'good', 'https://m.media-amazon.com/images/I/71dNa0p085L.jpg?odnHeight=117&odnWidth=117&odnBg=FFFFFF', 0, '2015-09-14'],
            [53, 26, 15, 'Antique Wooden Chair', 'Beautiful hand-carved chair from the 1960s. Solid wood, very sturdy.', 12000.00, 'good', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFyCBtyTdUuSxa1xmGylcfkyVhTH99vPmX5w&s', 0, '2021-04-23']
        ];
        await conn.query('INSERT INTO products (id, seller_id, category_id, name, description, price, condition_status, image_url, is_authentic, purchase_date) VALUES ?', [products]);

        console.log('✅ Cloud Database Seeded Successfully!');
        await conn.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding cloud database:', err);
        process.exit(1);
    }
};

seedCloud();
