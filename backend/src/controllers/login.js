const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserAccount = require("../model/UserModel");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Validate request body
    if (!username || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    // ✅ Find user by username
    const user = await UserAccount.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // ✅ Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "mydrive#@qwert123", // 🔒 Store in env file in real apps
      { expiresIn: "1h" }
    );

    // ✅ Send success response
    return res.status(200).json({
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} login successful`,
      token,
      role: user.role,
    });

  } catch (error) {
    console.error("❌ Login error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = login;
