const express = require("express");
const session = require("express-session");
const sequelize = require("./config/database"); // Database configuration
const otpRoutes = require("./routes/authRoutes"); // OTP routes
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Import models (to ensure they are registered with Sequelize)
const User = require("./models/User");
const Course = require("./models/Course");
const Chapter = require("./models/Chapter");
const Video = require("./models/Video");
const Payment = require("./models/Payment");
const Enrollment = require("./models/Enrollment");
const Earning = require("./models/Earning");
const Link = require("./models/Link");

// Import other routes
const bannerRoutes = require("./routes/bannerRoutes"); // Import the banner routes
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const videoRoutes = require("./routes/videoRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const earningRoutes = require("./routes/earningRoutes");
const driveRoutes = require("./routes/driveRoutes");
const linkRoutes = require("./routes/linkRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Enable CORS for all requests (during development)

// Session configuration (can be used for login sessions or OAuth if needed)
app.use(
  session({
    secret: "your_secret_key", // Replace with a secure secret
    resave: false,
    saveUninitialized: false,
  })
);

// Define API routes
app.use("/api/auth", otpRoutes); // OTP authentication routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/earnings", earningRoutes);
app.use("/api/link", linkRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/category", categoryRoutes);
app.use("/auth", authRoutes);

//to serve the uploaded

// Serve static files (for accessing uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Sync all models and start the server
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
    // Start the server after syncing the database
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("Error syncing database:", err));
