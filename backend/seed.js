const db = require('./config/db');
const bcrypt = require('bcrypt');

// Helper to generate random date within a range (days ago)
const randomDate = (minDays, maxDays) => {
    const today = new Date();
    const days = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    const date = new Date(today);
    date.setDate(today.getDate() - days);
    return date;
};

// Helper to generate listing date (must be after purchase date)
const randomListingDate = (purchaseDate) => {
    const today = new Date();
    const pDate = new Date(purchaseDate);
    const maxDays = Math.floor((today - pDate) / (1000 * 60 * 60 * 24));
    const daysAfterPurchase = Math.floor(Math.random() * maxDays);
    const date = new Date(pDate);
    date.setDate(pDate.getDate() + daysAfterPurchase);
    return date;
};

// Calculate condition based on age
const getCondition = (purchaseDate) => {
    const today = new Date();
    const pDate = new Date(purchaseDate);
    const diffTime = Math.abs(today - pDate);
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);

    if (diffYears < 1) return 'new';
    if (diffYears < 3) return 'like_new';
    return 'good';
};

const seedDatabase = async () => {
    try {
        const conn = db.promise();

        console.log('Starting Database Seed with Bangladeshi Brand Sellers...');

        // 1. Clear existing data
        console.log('Clearing old data...');
        await conn.query('DELETE FROM order_items');
        await conn.query('DELETE FROM orders');
        await conn.query('DELETE FROM reviews');
        await conn.query('DELETE FROM products');
        await conn.query('DELETE FROM users');
        await conn.query('DELETE FROM categories');

        // 2. Insert Sellers (Bangladeshi Brands + Others) - Not all verified
        console.log('Inserting Users...');
        const password = await bcrypt.hash('password123', 10);

        const sellers = [
            { name: 'Aarong', email: 'aarong@example.com', verified: true, specialty: 'Clothing' },
            { name: 'RFL', email: 'rfl@example.com', verified: true, specialty: 'Furniture' },
            { name: 'Singer', email: 'singer@example.com', verified: true, specialty: 'Electronics2' },
            { name: 'Walton', email: 'walton@example.com', verified: true, specialty: 'Electronics' },
            { name: 'Yamaha', email: 'yamaha@example.com', verified: true, specialty: 'Sports' },
            { name: 'BookWorm BD', email: 'bookworm@example.com', verified: false, specialty: 'Books' },
            { name: 'RetroFinds BD', email: 'retrofinds@example.com', verified: false, specialty: 'Vintage' },
            { name: 'ToyZone BD', email: 'toyzone@example.com', verified: false, specialty: 'Toys' }
        ];

        const sellerIds = {};
        for (const seller of sellers) {
            const [res] = await conn.query(
                'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
                [seller.name, seller.email, password, 'seller', seller.verified]
            );
            sellerIds[seller.specialty] = res.insertId;
        }

        // Admin
        await conn.query(
            'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
            ['System Administrator', 'admin@example.com', password, 'admin', true]
        );

        console.log(`Created ${sellers.length} sellers + 1 admin`);

        // 3. Insert Categories
        console.log('Inserting Categories...');
        const categories = [
            { name: 'Electronics', image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { name: 'Clothing', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { name: 'Furniture', image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { name: 'Toys', image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { name: 'Books', image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { name: 'Sports', image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400' }
        ];

        const categoryIds = {};
        for (const cat of categories) {
            const [res] = await conn.query('INSERT INTO categories (name, image_url) VALUES (?, ?)', [cat.name, cat.image]);
            categoryIds[cat.name] = res.insertId;
        }
        console.log('Categories inserted:', Object.keys(categoryIds).length);

        // 4. Insert Products with CORRECT images
        console.log('Inserting Products...');
        const products = [
            // Walton - Electronics
            { name: 'Walton Smart TV 43"', seller: 'Electronics', category: 'Electronics', price: 32000, auth: true, image: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg', desc: '43-inch Full HD Smart TV. Excellent picture quality with built-in apps.', type: 'fresh' },
            { name: 'Walton Refrigerator', seller: 'Electronics', category: 'Electronics', price: 28000, auth: true, image: 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg', desc: 'Energy-efficient refrigerator. 200L capacity, perfect for families.', type: 'old' },

            // Aarong - Clothing
            { name: 'Aarong Cotton Saree', seller: 'Clothing', category: 'Clothing', price: 3500, auth: true, image: 'https://images.pexels.com/photos/3692748/pexels-photo-3692748.jpeg', desc: 'Beautiful handwoven cotton saree. Traditional Bangladeshi design.', type: 'fresh' },
            { name: 'Aarong Punjabi (Men)', seller: 'Clothing', category: 'Clothing', price: 2200, auth: true, image: 'https://images.pexels.com/photos/8148577/pexels-photo-8148577.jpeg', desc: 'Premium cotton punjabi. Size L. Perfect for festivals.', type: 'old' },

            // RFL - Furniture
            { name: 'RFL Plastic Chair Set', seller: 'Furniture', category: 'Furniture', price: 4500, auth: true, image: 'https://images.pexels.com/photos/116910/pexels-photo-116910.jpeg', desc: 'Set of 4 durable plastic chairs. Weather-resistant.', type: 'old' },
            { name: 'RFL Study Table', seller: 'Furniture', category: 'Furniture', price: 5500, auth: true, image: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg', desc: 'Compact study table with drawer. Perfect for students.', type: 'fresh' },

            // Yamaha - Sports
            { name: 'Yamaha Acoustic Guitar', seller: 'Sports', category: 'Sports', price: 12000, auth: true, image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg', desc: 'Professional acoustic guitar. Great sound quality.', type: 'old' },
            { name: 'Yamaha Keyboard PSR-F51', seller: 'Sports', category: 'Electronics', price: 8500, auth: true, image: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg', desc: 'Beginner-friendly keyboard with 61 keys.', type: 'fresh' },

            // Singer - Electronics
            { name: 'Singer Sewing Machine', seller: 'Electronics2', category: 'Electronics', price: 15000, auth: true, image: 'https://images.pexels.com/photos/7191980/pexels-photo-7191980.jpeg', desc: 'Classic Singer sewing machine. Perfect for home use.', type: 'vintage' },
            { name: 'Singer Iron Box', seller: 'Electronics2', category: 'Electronics', price: 1800, auth: true, image: 'https://images.pexels.com/photos/6197122/pexels-photo-6197122.jpeg', desc: 'Steam iron with non-stick plate. Works perfectly.', type: 'old' },

            // BookWorm BD - Books (Not Verified)
            { name: 'Harry Potter Complete Set', seller: 'Books', category: 'Books', price: 3500, auth: false, image: 'https://images.pexels.com/photos/1301585/pexels-photo-1301585.jpeg', desc: 'All 7 books in good condition. Perfect for HP fans!', type: 'old' },
            { name: 'Programming Books Bundle', seller: 'Books', category: 'Books', price: 2200, auth: false, image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg', desc: '5 programming books including Python and JavaScript guides.', type: 'old' },
            { name: 'Atomic Habits (Hardcover)', seller: 'Books', category: 'Books', price: 650, auth: false, image: 'https://images.pexels.com/photos/6373305/pexels-photo-6373305.jpeg', desc: 'Popular self-help book. Read once, excellent condition.', type: 'fresh' },

            // RetroFinds BD - Vintage (Not Verified)
            { name: 'Vintage Cassette Player', seller: 'Vintage', category: 'Electronics', price: 4500, auth: false, image: 'https://images.pexels.com/photos/114820/pexels-photo-114820.jpeg', desc: 'Classic 1990s cassette player. Still works! Great for collectors.', type: 'vintage' },
            { name: 'Antique Wooden Chair', seller: 'Vintage', category: 'Furniture', price: 12000, auth: false, image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg', desc: 'Beautiful hand-carved chair from the 1960s. Solid wood, very sturdy.', type: 'vintage' },

            // ToyZone BD - Toys (Not Verified)
            { name: 'LEGO City Building Set', seller: 'Toys', category: 'Toys', price: 3500, auth: false, image: 'https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg', desc: 'Complete LEGO city set with 500+ pieces. Great for kids 6+.', type: 'old' },
            { name: 'Remote Control Car', seller: 'Toys', category: 'Toys', price: 2200, auth: false, image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg', desc: 'Fast RC car with rechargeable battery. Works perfectly.', type: 'fresh' },
            { name: 'Barbie Doll Collection', seller: 'Toys', category: 'Toys', price: 1800, auth: false, image: 'https://images.pexels.com/photos/8088493/pexels-photo-8088493.jpeg', desc: 'Set of 3 Barbie dolls with accessories. Like new condition.', type: 'fresh' },

            // Additional products
            { name: 'Cricket Bat', seller: 'Sports', category: 'Sports', price: 1600, auth: true, image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg', desc: 'Professional cricket bat. Well-maintained, ready to play.', type: 'old' },
            { name: 'Nike Running Shoes', seller: 'Clothing', category: 'Sports', price: 4200, auth: true, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', desc: 'Size 42. Comfortable and well-maintained. Great for jogging.', type: 'old' },
            { name: 'Wooden Bookshelf', seller: 'Furniture', category: 'Furniture', price: 5500, auth: true, image: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg', desc: '5-tier bookshelf. Solid wood construction. Can hold many books.', type: 'old' }
        ];

        let insertedCount = 0;
        for (const prod of products) {
            const catId = categoryIds[prod.category];
            const sellerId = sellerIds[prod.seller];

            if (catId && sellerId) {
                let purchaseDate;
                if (prod.type === 'fresh') {
                    purchaseDate = randomDate(0, 365);
                } else if (prod.type === 'old') {
                    purchaseDate = randomDate(366, 1095);
                } else { // vintage
                    purchaseDate = randomDate(1096, 5000);
                }

                const listingDate = randomListingDate(purchaseDate);
                const condition = getCondition(purchaseDate);

                await conn.query(
                    'INSERT INTO products (seller_id, category_id, name, description, price, condition_status, image_url, is_authentic, purchase_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [sellerId, catId, prod.name, prod.desc, prod.price, condition, prod.image, prod.auth, purchaseDate, listingDate]
                );
                insertedCount++;
            }
        }

        console.log(`Database Seeded Successfully! Inserted ${insertedCount} products across ${sellers.length} sellers.`);
        console.log('Verified Sellers: Aarong, RFL, Singer, Walton, Yamaha');
        console.log('Unverified Sellers: BookWorm BD, RetroFinds BD, ToyZone BD');
        process.exit();
    } catch (error) {
        console.error('Seeding Failed:', error);
        process.exit(1);
    }
};

seedDatabase();
