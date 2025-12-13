const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
    const { category, search, seller_id, sort, condition } = req.query;
    let query = 'SELECT p.*, u.name as seller_name, u.is_verified as seller_verified, c.name as category_name FROM products p JOIN users u ON p.seller_id = u.id JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];

    if (category) {
        query += ' AND c.name = ?';
        params.push(category);
    }

    if (search) {
        query += ' AND (p.name LIKE ? OR p.description LIKE ? OR u.name LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (seller_id) {
        query += ' AND p.seller_id = ?';
        params.push(seller_id);
    }

    if (condition) {
        query += ' AND p.condition_status = ?';
        params.push(condition);
    }

    if (sort) {
        switch (sort) {
            case 'price_asc':
                query += ' ORDER BY p.price ASC';
                break;
            case 'price_desc':
                query += ' ORDER BY p.price DESC';
                break;
            case 'date_asc':
                query += ' ORDER BY p.created_at ASC';
                break;
            case 'date_desc':
                query += ' ORDER BY p.created_at DESC';
                break;
            case 'age_asc':
                query += ' ORDER BY p.purchase_date DESC';
                break;
            case 'age_desc':
                query += ' ORDER BY p.purchase_date ASC';
                break;
            default:
                query += ' ORDER BY p.created_at DESC';
        }
    } else {
        query += ' ORDER BY p.created_at DESC';
    }

    try {
        const [products] = await db.promise().query(query, params);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [products] = await db.promise().query(
            'SELECT p.*, u.name as seller_name, u.is_verified as seller_verified, c.name as category_name FROM products p JOIN users u ON p.seller_id = u.id JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
            [req.params.id]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(products[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    const { name, description, price, condition_status, category_id, seller_id, image_url, purchase_date, created_at } = req.body;

    try {
        console.log('Received product data:', req.body);

        const categoryIdInt = parseInt(category_id);
        const purchaseDateFormatted = purchase_date ? new Date(purchase_date) : new Date();
        const createdAtFormatted = created_at ? new Date(created_at) : new Date();

        console.log('Formatted data:', {
            seller_id,
            categoryIdInt,
            name,
            description,
            price,
            condition_status,
            image_url,
            purchaseDateFormatted,
            createdAtFormatted
        });

        const [result] = await db.promise().query(
            'INSERT INTO products (seller_id, category_id, name, description, price, condition_status, image_url, is_authentic, purchase_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [seller_id, categoryIdInt, name, description, price, condition_status, image_url, false, purchaseDateFormatted, createdAtFormatted]
        );

        console.log('Product created successfully with ID:', result.insertId);
        res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
    } catch (error) {
        console.error('Error creating product:', error);
        console.error('Error details:', error.message);
        console.error('SQL State:', error.sqlState);
        console.error('SQL Message:', error.sqlMessage);
        res.status(500).json({ message: 'Server error', error: error.message, details: error.sqlMessage });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.promise().query('SELECT * FROM categories');
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    const { name, description, price, condition_status, category_id, image_url, purchase_date } = req.body;
    const productId = req.params.id;

    try {
        const categoryIdInt = parseInt(category_id);
        const purchaseDateFormatted = purchase_date ? new Date(purchase_date) : new Date();

        await db.promise().query(
            'UPDATE products SET name = ?, description = ?, price = ?, condition_status = ?, category_id = ?, image_url = ?, purchase_date = ? WHERE id = ?',
            [name, description, price, condition_status, categoryIdInt, image_url, purchaseDateFormatted, productId]
        );

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        await db.promise().query('DELETE FROM products WHERE id = ?', [productId]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.verifyProduct = async (req, res) => {
    const productId = req.params.id;
    const { is_authentic } = req.body;

    try {
        await db.promise().query('UPDATE products SET is_authentic = ? WHERE id = ?', [is_authentic, productId]);
        res.json({ message: 'Product verification status updated' });
    } catch (error) {
        console.error('Error verifying product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
