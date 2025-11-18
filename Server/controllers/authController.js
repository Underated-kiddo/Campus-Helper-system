const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// signup logic
exports.signup = async (req, res) => {
    try {
        const { email, password, role, name, contact } = req.body;

        // Ensure required fields
        if (!email || !password || !name || !contact) {
            return res.status(400).json({ message: "Email, password, name, and contact are required." });
        }

        // Check if user already exists
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Normalize role to lowercase if provided
        const normalizedRole = role ? role.toString().toLowerCase() : "student";

        // Create user
        const user = await User.create({
            email,
            password: hashed,
            role: normalizedRole,
            name,
            contact,
            profilePic: "",       
            bio: "",                 
            notifications: true,    
            privateMode: false,      
        });

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Return safe user info
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                contact: user.contact,
                profilePic: user.profilePic,
                bio: user.bio,
                notifications: user.notifications,
                privateMode: user.privateMode,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: error.message });
    }
};

// login logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Wrong password" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                contact: user.contact,
                profilePic: user.profilePic,
                bio: user.bio,
                notifications: user.notifications,
                privateMode: user.privateMode,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
};
