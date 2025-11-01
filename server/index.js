require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth"); // ✅ Authentication routes
const userRoutes = require("./routes/user"); // ✅ User routes

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173", // default Vite
  "http://localhost:5174", // sometimes Vite changes port
];

// ✅ Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: Not allowed by server"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes); // signup, login
app.use("/api/user", userRoutes); // get user info

// ✅ Test route
app.get("/api/ping", (req, res) => res.json({ ok: true, msg: "Server is running" }));

// ✅ Connect MongoDB and start server
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });