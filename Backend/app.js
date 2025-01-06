const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDatabase = require('./config/connectDatabase');
dotenv.config({path: path.join(__dirname, 'config', 'config.env')})

const products = require('./routes/product');
const orders = require('./routes/order');
const customer = require('./routes/customer');
const admin = require('./routes/auth');

connectDatabase();

app.use(express.json());
app.use(cors());
app.use('/api/v1/',products);
app.use('/api/v1/',orders);
app.use('/api/v1/',customer);
app.use('/api/v1/',admin);

// app.use(express.static(path.join(__dirname, 'uploads')));


if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'ecommerce', 'dist', 'ecommerce', 'browser')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'ecommerce', 'dist', 'ecommerce', 'browser', 'index.html'))
    });
}

app.listen(process.env.PORT, () => {
    console.log(`Server listening to Port ${process.env.PORT} in ${process.env.NODE_ENV}`)
});