const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

router.post('/signup', signup);

router.post('/login', login);

router.get('/profile', protect, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.status(200).json({
			id: user._id,
			email: user.email,
			role: user.role, 
		});
	} catch (error) {
		console.error('Profile route error:', error);
		return res.status(500).json({ message: 'Server error fetching profile' });
	}
});

module.exports = router;
