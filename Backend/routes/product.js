const express = require('express');
const { getProducts, getSingleProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();
const upload = require('../middleware/upload');

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/productsCreate').post(upload.single('file'), addProduct);
router.route('/productUpdate/:id').put(upload.single('image'), updateProduct);
router.route('/productDelete/:id').delete(deleteProduct);

module.exports = router;
