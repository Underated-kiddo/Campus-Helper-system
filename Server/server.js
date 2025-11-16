require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// Database & GridFS
const connectDB = require("./config/db");
const { initResourceBucket } = require("./config/gridfs");

const app = express();

// Connect to MongoDB + initialize GridFS for resources
connectDB().then(() => {
	console.log("MongoDB connected");
	initResourceBucket(); // GridFS bucket ready for resources
});

// CORS
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		credentials: true,
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// JSON parser
app.use(express.json());

// -------------------- ROUTES --------------------

// Authentication
app.use("/api/auth", require("./routes/authRoutes"));

// Lost & Found (disk uploads)
app.use("/api/lostnfound", require("./routes/lostnfoundRoutes"));

// Resources (GridFS uploads)
app.use("/api/resources", require("./routes/resourceRoutes"));

// Other modules
app.use("/api/tutors", require("./routes/tutorRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/school", require("./routes/schoolRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));

// -------------------- STATIC FILES --------------------

// Lost & Found local images
app.use(
	"/uploads/lostnfound",
	express.static(path.join(__dirname, "uploads/lostnfound"))
);

// -------------------- ERROR HANDLING --------------------
app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`Server is running on http://localhost:${PORT}`)
);
