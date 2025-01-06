const express = require('express');
const { createEmployee, getAllCustomers } = require('../controllers/customerController');

const router = express.Router();

router.post('/create-employee', createEmployee);
router.get('/getCustomers', getAllCustomers);

module.exports = router;
