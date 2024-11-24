// /backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { login } = require("../controllers/authController");

// Route to request OTP
router.post("/request-otp", authController.requestOtp);

// Route to verify OTP
router.post("/verify-otp", authController.verifyOtp);

//Route to login
router.post("/login", login);

module.exports = router;
