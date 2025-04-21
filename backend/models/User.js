const mongoose = require("mongoose");

// MongoDB User Schema
const userSchema = new mongoose.Schema({
    name: String,
    contactNumber: String,
    id: String,
    batch: String,
    branch: String,
    rollNumber: String,
    department: String,
    email: { type: String, required: true, lowercase: true, unique: true },
    password: String,
    role: String,
});

module.exports = mongoose.model("User", userSchema);