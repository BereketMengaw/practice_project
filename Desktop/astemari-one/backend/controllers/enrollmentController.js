const Enrollment = require("../models/Enrollment");

// Create a new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        error: "User ID and Course ID are required.",
      });
    }

    const enrollment = await Enrollment.create({ studentId, courseId });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({
      error: "Error creating enrollment",
      details: error.message,
    });
  }
};

// Get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll();

    if (!enrollments.length) {
      return res.status(404).json({ message: "No enrollments found" });
    }

    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error.message);
    res.status(500).json({
      error: "Error fetching enrollments",
      details: error.message,
    });
  }
};

// Get enrollment by ID
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollmentId = req.params.id;

    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (enrollment) {
      res.status(200).json(enrollment);
    } else {
      res.status(404).json({ error: "Enrollment not found" });
    }
  } catch (error) {
    console.error("Error fetching enrollment:", error.message);
    res.status(500).json({
      error: "Error fetching enrollment",
      details: error.message,
    });
  }
};

// Update enrollment by ID
exports.updateEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const enrollmentId = req.params.id;

    if (!userId && !courseId) {
      return res.status(400).json({
        error:
          "At least one field (User ID or Course ID) is required to update.",
      });
    }

    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Update fields
    enrollment.userId = userId || enrollment.userId;
    enrollment.courseId = courseId || enrollment.courseId;

    await enrollment.save();
    res.status(200).json(enrollment);
  } catch (error) {
    console.error("Error updating enrollment:", error.message);
    res.status(500).json({
      error: "Error updating enrollment",
      details: error.message,
    });
  }
};

// Delete enrollment by ID
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollmentId = req.params.id;

    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    await enrollment.destroy();
    res.status(200).json({
      message: `Enrollment with ID ${enrollmentId} has been deleted.`,
    });
  } catch (error) {
    console.error("Error deleting enrollment:", error.message);
    res.status(500).json({
      error: "Error deleting enrollment",
      details: error.message,
    });
  }
};
