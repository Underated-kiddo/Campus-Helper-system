require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(cors({
	origin: process.env.CLIENT_URL,
	credentials: true,
    }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/resources", express.static(path.join(__dirname, "uploads/resources")));

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const lostnfoundRoutes = require("./routes/lostnfoundRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/school", schoolRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/lostnfound", lostnfoundRoutes);

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
