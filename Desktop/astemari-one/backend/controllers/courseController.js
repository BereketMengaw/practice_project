const Course = require("../models/Course");
const fs = require("fs");
const path = require("path");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    // Validate incoming data
    if (!req.body.title || !req.body.description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error.message);
    res
      .status(500)
      .json({ error: "Error creating course", details: error.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    if (!courses.length) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    res
      .status(500)
      .json({ error: "Error fetching courses", details: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error fetching course:", error.message);
    res
      .status(500)
      .json({ error: "Error fetching course", details: error.message });
  }
};

// Update course by ID
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, price, creatorId } = req.body;
    const courseId = req.params.id;

    // Validate incoming data
    if (!title && !description && !price && !creatorId) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });
    }

    // Find the course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Update course
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.creatorId = creatorId || course.creatorId;

    await course.save();

    // Return updated course
    res.status(200).json(course);
  } catch (error) {
    console.error("Error updating course:", error.message);
    res
      .status(500)
      .json({ error: "Error updating course", details: error.message });
  }
};

// Delete course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await course.destroy();

    res
      .status(200)
      .json({ message: `Course with ID ${courseId} has been deleted` });
  } catch (error) {
    console.error("Error deleting course:", error.message);
    res
      .status(500)
      .json({ error: "Error deleting course", details: error.message });
  }
};

// to fetch courses for only the selected creator with using its id

exports.getCoursesByCreator = async (req, res) => {
  const { creatorId } = req.params; // Get creatorId from route parameter

  try {
    // Fetch courses where the creatorId matches
    const courses = await Course.findAll({
      where: { creatorId },
    });

    // Check if courses are found
    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this creator." });
    }

    // Return the filtered courses
    return res.status(200).json(courses);
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching courses." });
  }
};

exports.uploadThumbnail = async (req, res) => {
  try {
    const courseId = req.params.id;
    const thumbnailPath = `/uploads/thumbnails/${req.file.filename}`;

    // Find course by ID
    const course = await Course.findByPk(courseId);
    if (!course) {
      // Remove uploaded file if course doesn't exist
      const uploadedFile = path.join(__dirname, "..", "public", thumbnailPath);
      if (fs.existsSync(uploadedFile)) fs.unlinkSync(uploadedFile);

      return res.status(404).json({ error: "Course not found" });
    }

    // Update the course with the thumbnail path
    course.thumbnail = thumbnailPath;
    await course.save();

    res.status(200).json({
      message: "Thumbnail uploaded successfully",
      thumbnail: thumbnailPath,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// (Optional) Delete thumbnail logic
exports.deleteThumbnail = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const thumbnailPath = `public${course.thumbnail}`;
    if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);

    course.thumbnail = null;
    await course.save();

    res.status(200).json({ message: "Thumbnail deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
