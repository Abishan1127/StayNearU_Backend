const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, contactNumber, email, password, confirmPassword, agreeToTerms } = req.body;

    // Debug log (optional)
    // console.log("Incoming data:", req.body);

    if (!name || !contactNumber || !email || !password || !confirmPassword || !agreeToTerms) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match!" });
    }

    // Check if user already exists
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: "Email already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    await db.query(
      "INSERT INTO users (name, contact_number, email, password) VALUES (?, ?, ?, ?)",
      [name, contactNumber, email, hashedPassword]
    );

    res.status(201).json({ success: true, message: "User registered successfully!" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please check logs for details." });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required!" });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials!" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" });
    res.json({ success: true, message: "Login successful!", token });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// Logout User
exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully!" });
};

// Verify User Authentication
exports.verifyUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token!" });
    }
    res.json({ success: true, user });
  });
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users ORDER BY id ASC");
    res.json({ success: true, users });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }
    res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// Update User by ID
exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, contactNumber, email } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    await db.query(
      "UPDATE users SET name = ?, contact_number = ?, email = ? WHERE id = ?",
      [name, contactNumber, email, id]
    );

    res.json({ success: true, message: "User updated successfully!" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// Delete User by ID
exports.deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
