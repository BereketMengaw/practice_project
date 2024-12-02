const User = require("../models/User");
const { generateToken, verifyToken } = require("../config/jwt");

exports.signup = async (req, res) => {
  const { name, phoneNumber, gmail, role, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = await User.create({
      name,
      phoneNumber,
      gmail,
      role,
      password,
    });
    const token = generateToken({
      id: newUser.id,
      phoneNumber: newUser.phoneNumber,
    });

    res.json({ message: "Signup successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = generateToken({ id: user.id, phoneNumber: user.phoneNumber });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.protectedRoute = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    // Fetch user details from the database using the user ID from the decoded token
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "phoneNumber"], // Include only the necessary fields
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Access granted",
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (err) {
    console.error("Error in protected route:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};
