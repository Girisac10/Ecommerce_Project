const ProductModel = require('../models/productModel');
const upload = require('../middleware/upload');

exports.getProducts = async (req, res, next) => {
    const query = req.query.keyword?{ name : { 
        $regex: req.query.keyword,
        $options: 'i'
     }}:{}
    const products = await ProductModel.find(query);
    
    res.json({
        success: true,
        products
    })
}

exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        res.json({
            success: true,
            product
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Unable to get Product with that ID'
        })
    }
}

exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, ratings, images, category, seller, stock, review } = req.body;

        const newProduct = new ProductModel({
            name,
            price,
            description,
            ratings,
            images,
            category: category.toUpperCase(), // Convert category to uppercase
            seller,
            stock,
            review,
        });

        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

  
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, ratings, images, category, seller, stock, review } = req.body;

  try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
          id, // Product ID
          {
              name,
              price,
              description,
              ratings,
              images,
              category: category.toUpperCase(), // No conversion here as the category might already be in the desired format
              seller,
              stock,
              review,
          },
          { new: true } // Return the updated document
      );

      if (!updatedProduct) {
          return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json(updatedProduct);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update product' });
  }
};



exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Extract product ID from the request
        const product = await ProductModel.findByIdAndDelete(productId); // Find and delete product by ID

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'No product found with the provided ID',
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message,
        });
    }
};
