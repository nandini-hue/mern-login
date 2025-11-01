// server/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend origin(s) — prefer setting FRONTEND_URL in production (Vercel)
const allowedOrigins = [
  process.env.FRONTEND_URL,   // set this in Railway to your Vercel URL (production)
  "http://localhost:5173",    // Vite dev default
  "http://localhost:5174",    // alternative dev port
].filter(Boolean); // removes undefined if FRONTEND_URL not set

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g., Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("CORS blocked origin:", origin);
      return callback(new Error("CORS policy: Not allowed by server"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.get("/api/ping", (req, res) => res.json({ ok: true, msg: "Server is running" }));

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
