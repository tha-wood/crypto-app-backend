const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   GET /register (from README) - NOTE: Ideally this should be POST, handled it to process data via query for GET or body for POST to be safe. Since frontend will send data, it will likely be POST if standard, but we'll adapt to POST first. Wait, user said "don't change it if that's what the readme specified."
// This means the endpoint is GET /register. We will get data from req.query since it's a GET request.
const registerUser = async (req, res) => {
  // Try req.query first (for GET), fallback to req.body (if they actually mean POST)
  const name = req.query.name || req.body.name;
  const email = req.query.email || req.body.email;
  const password = req.query.password || req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: 'Registration successful',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   GET /login
const authUser = async (req, res) => {
  const email = req.query.email || req.body.email;
  const password = req.query.password || req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, 
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: 'Login successful',
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
};
