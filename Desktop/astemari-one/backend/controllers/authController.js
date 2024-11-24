const User = require("../models/User"); // Importing the User model
console.log(User);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const otpService = require("../services/otpService");
const otpUtils = require("../utils/otpUtils");

// Request OTP: This will generate an OTP, send it to the user, and store it temporarily
exports.requestOtp = async (req, res) => {
  const { email } = req.body; // Get email from the request body
  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    const otp = otpUtils.generateOtp(); // Generate OTP
    await otpService.sendOtp(email, otp); // Send OTP to the user's email via Gmail
    otpService.storeOtp(email, otp); // Store OTP temporarily (in-memory, can be replaced with DB)
    res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

// Verify OTP: This will check if the provided OTP is valid
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body; // Get email and OTP from the request body

  if (!email || !otp) {
    return res.status(400).send("Email and OTP are required");
  }

  const verificationResult = otpService.verifyOtp(email, otp); // Verify OTP from the store
  if (verificationResult === "OTP is valid") {
    res.status(200).send("User authenticated successfully"); // OTP is valid
  } else {
    res.status(400).send(verificationResult); // Invalid or expired OTP
  }
};

exports.login = async (req, res) => {
  const { name, password } = req.body;

  // Validate input
  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required." });
  }

  try {
    // Find user in the database
    const user = await User.findOne({ where: { name } });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return token
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
