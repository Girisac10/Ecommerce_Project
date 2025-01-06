const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const Customer = require('../models/customerModel');

exports.loginUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Check if the user is Admin
        if (email === 'admin@gmail.com') {
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(404).json({ message: 'Admin not registered' });
            }

            const isValidPassword = await bcrypt.compare(password, admin.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Wrong password' });
            }

            const token = jwt.sign(
                { email: admin.email, username: admin.userName, role: 'Admin' },
                process.env.ADMIN_KEY,
                { expiresIn: '1h' }
            );
            res.cookie('token', token, { httpOnly: true, secure: false });
            return res.json({ message: 'Admin login successful', role: 'Admin', token: token });
        }

        // Check if the user is a Customer
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not registered' });
        }

        const isValidPassword = await bcrypt.compare(password, customer.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        const token = jwt.sign(
            { email: customer.email, username: customer.userName, role: 'Customer' },
            process.env.CUSTOMER_KEY,
            { expiresIn: '1d' }
        );
        res.cookie('token', token, { httpOnly: true, secure: false });
        return res.json({ message: 'Customer login successful', role: 'Customer', token: token });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.logoutUser = (req, res) => {
    res.clearCookie('token');
    return res.json({ logout: true });
};
