const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.registerUser = async (req, res) => {
  try {
      const { name, contactNumber, email, password, confirmPassword, agreeToTerms } = req.body;

      if (!name || !contactNumber || !email || !password || !confirmPassword || !agreeToTerms) {
          return res.status(400).json({ success: false, message: "All fields are required!" });
      }

      if (password !== confirmPassword) {
          return res.status(400).json({ success: false, message: "Passwords do not match!" });
      }

      // Check if user already exists
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
          return res.status(400).json({ success: false, message: "Email already exists!" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      await db.query(
          "INSERT INTO users (name, contact_number, email, password) VALUES (?, ?, ?, ?)",
          [name, contactNumber, email, hashedPassword]
      );

      res.status(201).json({ success: true, message: "User registered successfully!" });getAllUsers

  } catch (error) {
      console.error(" Registration Error:", error);  //  Log the actual error
      res.status(500).json({ success: false, message: "Server error. Please check logs for details." });
  }
};


//  Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required!" });
        }

        // Check if user exists
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Store token in HTTP-Only Cookie (More Secure)
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" });

        res.json({ success: true, message: "Login successful!", token });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};

// Logout User
exports.logoutUser = async (req, res) => {
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
// get all users
exports.getAllUsers = async (req, res) => {
  try {
      const [users] = await db.query("SELECT * FROM users ORDER BY id ASC");
      res.json({ success: true, users });
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
// get user by id
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
      const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      if (user.length === 0) {
          return res.status(404).json({ success: false, message: "User not found!" });
      }
      res.json({ success: true, user });
  } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
// update user by id
exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, contactNumber, email } = req.body;
  try {
      const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      if (user.length === 0) {
          return res.status(404).json({ success: false, message: "User not found!" });
      }
      await db.query("UPDATE users SET name = ?, contact_number = ?, email = ? WHERE id = ?", [name, contactNumber, email, id]);
      res.json({ success: true, message: "User updated successfully!" });
  } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
// delete user by id
exports.deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
      const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      if (user.length === 0) {
          return res.status(404).json({ success: false, message: "User not found!" });
      }
      await db.query("DELETE FROM users WHERE id = ?", [id]);
      res.json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};