const express = require('express');
const router = express.Router();
const {createOrder, getAllOrders, updateOrderStatus} = require('../controllers/orderController');

router.route('/order').post(createOrder);
router.route('/orders').get(getAllOrders);
router.route('/orderUpdate/:id').put(updateOrderStatus);

module.exports = router;