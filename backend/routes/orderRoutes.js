const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, orderController.getAllOrders);
router.get('/buyer/:id', protect, orderController.getOrdersByBuyerId);
router.get('/seller/:id', protect, orderController.getOrdersBySellerId);
router.get('/:id', protect, orderController.getOrderById);
router.post('/', protect, orderController.createOrder);
router.put('/:id', protect, orderController.updateOrderStatus);
router.delete('/:id', protect, orderController.deleteOrder);

module.exports = router;
