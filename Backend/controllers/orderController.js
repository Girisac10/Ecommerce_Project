const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

exports.createOrder = async (req, res, next) => {
    const cartItems = req.body;
    const amount = parseFloat(cartItems.reduce((acc, item) => (acc + item.product.price.replace(/,/g, '') * item.qty), 0)).toFixed(2);
    const status = 'processing';
    const order = await orderModel.create({cartItems, amount, status})

    cartItems.forEach(async (item)=> {
        const product = await productModel.findById(item.product._id);
        product.stock = product.stock - item.qty;
        await product.save();
    })

    res.json(
        {
            success:true,
            order
        }
    )
}

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderModel.find();
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
      const { status } = req.body;
      const { id } = req.params;
  
      const order = await orderModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
  
      res.json({
        success: true,
        message: 'Order status updated successfully',
        order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating order status',
        error: error.message,
      });
    }
  };
  