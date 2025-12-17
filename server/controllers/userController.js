import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // ✅ Must include .js

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/users/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Count total farmers
    const farmerCount = await User.countDocuments({ role: 'farmer' });
    
    // 2. Count pending reports
    // ⚠️ I commented this out because you don't have a Report model imported yet.
    // const pendingCount = await Report.countDocuments({ status: 'pending' }); 
    const pendingCount = 0; 

    res.status(200).json({
      farmers: farmerCount,
      pendingReports: pendingCount,
    });
  } catch (error) {
    console.error(error); // Log the actual error to console so you can see it
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please add all fields' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'farmer' 
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ error: 'Invalid user data' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  // Check password
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne(); // or await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// ❌ DELETE THE "module.exports" lines at the bottom.
// We are using "export const" above, so we don't need module.exports.