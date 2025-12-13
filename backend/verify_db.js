const db = require('./config/db');

const verifyDatabase = async () => {
    try {
        const conn = db.promise();
        console.log('Verifying Database Content...');

        // Check Users
        const [users] = await conn.query('SELECT COUNT(*) as count FROM users');
        console.log(`Users: ${users[0].count}`);

        // Check Categories
        const [categories] = await conn.query('SELECT COUNT(*) as count FROM categories');
        console.log(`Categories: ${categories[0].count}`);

        // Check Products
        const [products] = await conn.query('SELECT COUNT(*) as count FROM products');
        console.log(`Products: ${products[0].count}`);

        // Check Lifespan Distribution (approximate check via dates)
        // Fresh: < 365 days
        const [fresh] = await conn.query('SELECT COUNT(*) as count FROM products WHERE DATEDIFF(NOW(), purchase_date) <= 365');
        console.log(`Fresh Products (<1yr): ${fresh[0].count}`);

        // Old: 366 - 1095 days
        const [old] = await conn.query('SELECT COUNT(*) as count FROM products WHERE DATEDIFF(NOW(), purchase_date) > 365 AND DATEDIFF(NOW(), purchase_date) <= 1095');
        console.log(`Old Products (1-3yrs): ${old[0].count}`);

        // Vintage: > 1095 days
        const [vintage] = await conn.query('SELECT COUNT(*) as count FROM products WHERE DATEDIFF(NOW(), purchase_date) > 1095');
        console.log(`Vintage Products (>3yrs): ${vintage[0].count}`);

        if (products[0].count === 0) {
            console.error('ERROR: No products found! Seeding might have failed.');
            process.exit(1);
        }

        console.log('Database Verification Passed!');
        process.exit(0);
    } catch (error) {
        console.error('Verification Failed:', error);
        process.exit(1);
    }
};

verifyDatabase();
