// server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // hashed password
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
