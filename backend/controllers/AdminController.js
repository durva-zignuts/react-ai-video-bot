const { admin } = require("../../backend/models");
const db = require("../../backend/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create Main Model
const Admin = db.admin;

const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if all required fields are provided
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if an admin with the same email already exists
    const existingAdmin = await Admin.findOne({ where: { email } });

    if (existingAdmin) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new admin
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Respond with the newly created admin
    return res.status(201).json({ message: "Admin created", admin: newAdmin });
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((e) => e.message);
      return res.status(400).json({ error: errorMessage });
    }

    return res
      .status(500)
      .json({ error: "An error occurred while creating the admin" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    // Compare passwords
    bcrypt.compare(password, admin.password, (err, result) => {
      if (err || !result) {
        console.log("wrong auth cred", err);
        return res.status(400).json({
          message: "Invalid Email or Password",
          err: "Wrong credentials",
        });
      }

      // Generate token
      const token = jwt.sign(
        {
          email: admin.email,
          adminId: admin.id,
        },
        process.env.JWT_KEY,
        { expiresIn: "3h" }
      );

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({
        message: "Admin logged in successfully",
        token,
        adminId: admin.id,
      });
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while logging in" });
  }
};

const logout = (req, res) => {
  // logout concept
  return res.clearCookie("access_token").status(200).json({
    message: "Admin logged out successfully",
  });
};

module.exports = {
  signup,
  login,
  logout,
};
