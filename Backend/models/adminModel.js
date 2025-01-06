const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true}
})

const adminModel = mongoose.model('Admin', adminSchema)
module.exports = adminModel;