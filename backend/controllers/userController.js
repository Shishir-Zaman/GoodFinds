const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.promise().query(
            'SELECT id, name, email, role, is_verified, created_at FROM users WHERE role != "admin"'
        );
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSellers = async (req, res) => {
    try {
        const [sellers] = await db.promise().query(
            'SELECT id, name, role, is_verified FROM users WHERE role = "seller"'
        );
        res.json(sellers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const [users] = await db.promise().query(
            'SELECT id, name, email, role, is_verified, created_at FROM users WHERE id = ?',
            [req.params.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserProducts = async (req, res) => {
    try {
        const [products] = await db.promise().query(
            'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.seller_id = ? ORDER BY p.created_at DESC',
            [req.params.id]
        );

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyUser = async (req, res) => {
    const userId = req.params.id;
    const { is_verified } = req.body;

    try {
        await db.promise().query('UPDATE users SET is_verified = ? WHERE id = ?', [is_verified, userId]);
        res.json({ message: 'User verification status updated' });
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await db.promise().query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
