
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// helper to shape safe user object
const sanitizeUser = (userDoc) => ({
  id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  role: userDoc.role,
  createdAt: userDoc.createdAt,
  updatedAt: userDoc.updatedAt,
});

/**
 * POST /api/auth/user/register
 * Body: { name, email, password }
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // email exists?
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // create
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
    });

    // token
    const token = generateToken({ id: user._id, role: user.role });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/auth/admin/register
 * Body: { name, email, password, adminCode? }
 * Optional protection using ADMIN_REGISTRATION_CODE in .env
 */
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // optional gate to prevent anyone from creating an admin
    if (process.env.ADMIN_REGISTRATION_CODE) {
      if (!adminCode || adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
        return res.status(403).json({ message: "Invalid admin registration code" });
      }
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });

    const token = generateToken({ id: admin._id, role: admin.role });

    return res.status(201).json({
      message: "Admin registered successfully",
      token,
      user: sanitizeUser(admin),
    });
  } catch (err) {
    console.error("registerAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  registerAdmin,
};
