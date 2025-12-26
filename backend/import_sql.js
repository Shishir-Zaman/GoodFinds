const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const importSql = async () => {
    try {
        console.log('🔌 Connecting to database...');
        const connection = await mysql.createConnection(process.env.DATABASE_URL || {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
        });

        console.log('🗑️  Cleaning up existing tables...');
        // Disable foreign key checks to allow dropping tables in any order
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        const tables = ['reviews', 'order_items', 'orders', 'products', 'categories', 'users'];
        for (const table of tables) {
            await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
            console.log(`   - Dropped table ${table}`);
        }

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('📖 Reading SQL file...');
        const sqlPath = path.join(__dirname, '../database/goodfinds updated.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon but ignore comments
        // This is a naive split, but sufficient for standard dumps
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

        console.log(`🚀 Executing ${statements.length} statements...`);

        for (const statement of statements) {
            // calculated percentages or progress could go here
            try {
                await connection.query(statement);
            } catch (err) {
                // Ignore specific errors like "Query was empty" or comment-only blocks
                if (err.code !== 'ER_EMPTY_QUERY') {
                    console.warn(`⚠️ Warning executing statement: ${err.message}`);
                    // console.warn(statement.substring(0, 50) + '...');
                }
            }
        }

        console.log('✅ Database updated successfully!');
        await connection.end();
        process.exit(0);

    } catch (err) {
        console.error('❌ Error importing database:', err);
        process.exit(1);
    }
};

importSql();
