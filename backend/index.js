require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://campulse-sit.vercel.app",
  credentials: true,
}));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

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

const User = mongoose.model("User", userSchema);

// Attach user model to app for use in routes
app.set("User", User);

// Seed Super Admin
const seedSuperAdmin = async () => {
  const existingAdmin = await User.findOne({ role: "superadmin", id: "admin" });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("123", 10);
    const newAdmin = new User({
      id: "admin",
      email: "admin@campulse.com",
      password: hashedPassword,
      role: "superadmin",
    });

    await newAdmin.save();
  }
};

connectDB().then(() => {
  seedSuperAdmin();
  app.use("/api/events", (req, res, next) => {
    req.User = User;
    next();
  }, eventRoutes);
});

// Routes
app.get("/", (req, res) => {
  res.send("Backend with MongoDB is running!");
});



// Student Registration
app.post("/register/student", async (req, res) => {
  const { name, contactNumber, batch, branch, rollNumber, email, password } = req.body;

  if (!batch || !branch || !rollNumber || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const studentId = `${batch}${branch}${rollNumber}`;
  const existing = await User.findOne({ email: email.toLowerCase(), role: "student" });

  if (existing) {
    return res.status(400).json({ message: "Student already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newStudent = new User({
    name,
    contactNumber,
    id: studentId,
    batch,
    branch,
    rollNumber,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "student",
  });

  await newStudent.save();

  res.status(200).json({ message: "Student registration successful", user: { ...newStudent.toObject(), password: undefined } });
});

// Staff Registration
app.post("/register/staff", async (req, res) => {
  const { department, email, password } = req.body;

  if (!department || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailLower = email.toLowerCase();
  const existing = await User.findOne({ email: emailLower, role: "staff" });

  if (existing) {
    return res.status(400).json({ message: "Staff already exists" });
  }

  const staffCount = await User.countDocuments({ role: "staff", department });
  const staffId = `FAC_${department}_${String(staffCount + 1).padStart(2, "0")}`;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newStaff = new User({
    id: staffId,
    department,
    email: emailLower,
    password: hashedPassword,
    role: "staff",
  });

  await newStaff.save();

  res.status(200).json({ message: "Staff registration successful", user: { ...newStaff.toObject(), password: undefined } });
});

// Login
app.post("/login", async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ message: "ID/Email and password required" });
  }

  const user = await User.findOne({
    $or: [{ id: id }, { email: id.toLowerCase() }],
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.status(200).json({ message: "Login successful", user: { ...user.toObject(), password: undefined } });
});

// Get all users except staff and superadmin
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({
      role: { $nin: ["staff", "superadmin"] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Update user role
app.patch("/users/:id/role", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Role updated", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
