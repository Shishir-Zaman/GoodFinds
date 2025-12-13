const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, userController.getAllUsers);
router.get('/sellers', userController.getSellers);
router.get('/:id', userController.getUserById);
router.get('/:id/products', userController.getUserProducts);
router.put('/:id/verify', protect, admin, userController.verifyUser);
router.delete('/:id', protect, admin, userController.deleteUser);

module.exports = router;
