const Employee = require('../models/customerModel');
const bcrypt = require('bcrypt');

// Helper function to calculate age
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const isBeforeBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (isBeforeBirthday) {
    age--;
  }
  return age;
}

// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const { userName, email, countryCode, phoneNumber, location, password, confirmPassword, dob } = req.body;

    // Validate required fields
    if (!userName || !email || !countryCode || !phoneNumber || !location || !password || !confirmPassword || !dob) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and Confirm Password must match' });
    }

    const dobDate = new Date(dob);
    if (dobDate > new Date()) {
      return res.status(400).json({ message: 'Date of birth cannot be in the future' });
    }

    const age = calculateAge(dobDate);
    if (age < 18) {
      return res.status(400).json({ message: 'Employee must be at least 18 years old' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check for unique username and email
    const existingEmployee = await Employee.findOne({ $or: [{ email }, { userName }] });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with the same email or username already exists' });
    }

    const newEmployee = new Employee({
      userName,
      email,
      countryCode,
      phoneNumber,
      location,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      dob: dobDate,
    });

    await newEmployee.save();

    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Employee.find(); // Fetch all customers from the database
    if (customers.length === 0) {
      return res.status(404).json({ message: 'No customers found' });
    }
    res.status(200).json({ message: 'Customers retrieved successfully', customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
