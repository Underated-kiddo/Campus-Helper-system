const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔒 Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    // Check for token in headers or cookies
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // If no token, deny access
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from DB (excluding password)
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach user object to request
        req.user = user;

        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
};

// 🧠 Middleware for role-based access
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // If user or role is missing
        if (!req.user || !req.user.role) {
            return res
                .status(401)
                .json({ message: "User role missing or unauthorized" });
        }

        // Check if the user's role is in the allowed list
        if (!allowedRoles.map((r) => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    };
};

module.exports = { protect, authorizeRoles };
