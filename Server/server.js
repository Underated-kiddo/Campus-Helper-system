require ("dotenv").config();
const express = require('express');
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

// CORS - allow requests from the frontend and allow credentials (cookies/auth headers)
const corsOptions = {
	origin: process.env.CLIENT_URL || "http://localhost:5173",
	credentials: true,
	allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth" , require("./routes/authRoutes"));
app.use("/api/post" , require("./routes/postRoutes"));

const PORT = process.env.PORT  || 5000 ;
app.listen(PORT , () => console.log(`Server is running on http://localhost:${PORT}`));