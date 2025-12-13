const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const { buyer_id, items, total_amount } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        // 1. Create Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (buyer_id, total_amount, status) VALUES (?, ?, ?)',
            [buyer_id, total_amount, 'pending']
        );
        const orderId = orderResult.insertId;

        // 2. Insert Order Items
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, price) VALUES (?, ?, ?)',
                [orderId, item.id, item.price]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Failed to place order' });
    } finally {
        connection.release();
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.promise().query(
            'SELECT o.*, u.name as buyer_name FROM orders o JOIN users u ON o.buyer_id = u.id ORDER BY o.created_at DESC'
        );
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const [orders] = await db.promise().query(
            'SELECT o.*, u.name as buyer_name FROM orders o JOIN users u ON o.buyer_id = u.id WHERE o.id = ?',
            [req.params.id]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const [items] = await db.promise().query(
            'SELECT oi.*, p.name as product_name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
            [req.params.id]
        );

        res.json({ ...orders[0], items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    try {
        await db.promise().query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, orderId]
        );
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        await db.promise().query('DELETE FROM orders WHERE id = ?', [orderId]);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getOrdersByBuyerId = async (req, res) => {
    try {
        const [orders] = await db.promise().query(
            'SELECT o.*, u.name as buyer_name FROM orders o JOIN users u ON o.buyer_id = u.id WHERE o.buyer_id = ? ORDER BY o.created_at DESC',
            [req.params.id]
        );

        for (let order of orders) {
            const [items] = await db.promise().query(
                'SELECT oi.*, p.name as product_name, p.image_url, p.seller_id, u.name as seller_name FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN users u ON p.seller_id = u.id WHERE oi.order_id = ?',
                [order.id]
            );
            order.items = items;
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrdersBySellerId = async (req, res) => {
    try {
        // This is more complex as orders are linked to buyers, but items are linked to products which have sellers.
        // We need to find orders that contain products sold by this seller.
        const query = `
            SELECT DISTINCT o.*, u.name as buyer_name 
            FROM orders o 
            JOIN order_items oi ON o.id = oi.order_id 
            JOIN products p ON oi.product_id = p.id 
            JOIN users u ON o.buyer_id = u.id
            WHERE p.seller_id = ? 
            ORDER BY o.created_at DESC
        `;

        const [orders] = await db.promise().query(query, [req.params.id]);

        // We might also want to filter the ITEMS in those orders to only show the ones from this seller
        // But for the order list, showing the order itself is a good start. 
        // The frontend currently filters items manually, so we can send the full order and let frontend filter items, 
        // OR we can fetch items here.

        // Let's attach items to these orders so the frontend doesn't have to fetch all orders
        for (let order of orders) {
            const [items] = await db.promise().query(
                'SELECT oi.*, p.name as product_name, p.seller_id FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ? AND p.seller_id = ?',
                [order.id, req.params.id]
            );
            order.items = items;
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
