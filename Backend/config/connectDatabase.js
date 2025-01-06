const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');

const seedAdminAccount = async () => {
    try {
        const existingAdmin = await Admin.findOne({ userName: "admin" });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10); // Hash the default password
            const admin = new Admin({
                userName: "admin", // Default admin username
                email: "admin@gmail.com", // Default admin email
                password: hashedPassword, // Hashed password
            });

            await admin.save();
            console.log("Admin account created successfully.");
        } else {
            console.log("Admin account already exists.");
        }
    } catch (error) {
        console.error("Error seeding admin account:", error);
    }
};


const connectDatabase = () => {
    mongoose
        .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(async (con) => {
            console.log('MongoDB connected to host: ' + con.connection.host);
            await seedAdminAccount(); // Seed the admin account after connecting to the database
        })
        .catch((error) => {
            console.error('Database connection error:', error);
        });
};

module.exports = connectDatabase;