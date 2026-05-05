const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// As per README specifications:
router.get('/register', registerUser);
router.get('/login', authUser);
router.get('/profile', protect, getUserProfile);

// Also exposing them as POST just in case the frontend relies on sensible defaults
router.post('/register', registerUser);
router.post('/login', authUser);

module.exports = router;
