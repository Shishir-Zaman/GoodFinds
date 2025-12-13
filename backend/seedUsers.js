const db = require('./config/db');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const users = [
    // Buyers
    { name: 'Shishir', email: 'shishir_buyer@example.com', password: 'password123', role: 'buyer' },
    { name: 'Chayan', email: 'chayan_buyer@example.com', password: 'password123', role: 'buyer' },
    { name: 'Rafsan', email: 'rafsan_buyer@example.com', password: 'password123', role: 'buyer' },
    { name: 'Tamim', email: 'tamim_buyer@example.com', password: 'password123', role: 'buyer' },
    // Admins
    { name: 'Shishir', email: 'shishir_admin@example.com', password: 'password123', role: 'admin' },
    { name: 'Chayan', email: 'chayan_admin@example.com', password: 'password123', role: 'admin' },
    { name: 'Rafsan', email: 'rafsan_admin@example.com', password: 'password123', role: 'admin' },
    { name: 'Tamim', email: 'tamim_admin@example.com', password: 'password123', role: 'admin' }
];

const seedUsers = async () => {
    try {
        console.log('Seeding users...');

        for (const user of users) {
            // Check if user exists
            const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ?', [user.email]);

            if (existing.length === 0) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);

                await db.promise().query(
                    'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
                    [user.name, user.email, hashedPassword, user.role, true]
                );
                console.log(`Created ${user.role}: ${user.name} (${user.email})`);
            } else {
                console.log(`User already exists: ${user.email}`);
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
