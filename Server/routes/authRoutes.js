const express = require('express');
const { signup, login } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// profile endpoint used by frontend to verify token and get user info
router.get('/profile', protect, async (req, res) => {
	try {
		// req.user is the decoded token payload ({ id, role })
		const user = await User.findById(req.user.id).select('-password');
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json({ id: user._id, email: user.email, role: user.role });
	} catch (error) {
		console.error('Profile error:', error);
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;