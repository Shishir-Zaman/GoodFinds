const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const { protect, admin, seller } = require('../middleware/authMiddleware');

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});

const upload = multer({ storage: storage });

router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);
router.post('/', protect, seller, upload.single('image'), productController.createProduct);
router.put('/:id', protect, seller, productController.updateProduct);
router.delete('/:id', protect, seller, productController.deleteProduct);
router.put('/:id/verify', protect, admin, productController.verifyProduct);

module.exports = router;
