require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");


const app = express();
connectDB();

// CORS setup
const corsOptions = {
	origin: process.env.CLIENT_URL || "http://localhost:5173",
	credentials: true,
	allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); 
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/lostnfound", require("./routes/lostnfoundRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/api/tutors", require("./routes/tutorRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/admin", adminRoutes); 

// Serve static files (like uploaded images) 
app.use("/uploads", express.static("uploads"));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
