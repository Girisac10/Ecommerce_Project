const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    description: String,
    ratings: String,
    images: String,
    category: String,
    seller: String,
    stock: Number,
    numOfReviews: String,
    createdAt: Date
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;