const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Setup multer for file uploads
const upload = multer({ dest: "public/uploads/thumbnails/" });

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, categoryId, creatorId } = req.body;

    // Validate incoming data
    if (!title || !description || !price || !categoryId || !creatorId) {
      return res.status(400).json({
        error: "Title, description, price, category, and creator are required.",
      });
    }

    const course = await Course.create({
      title,
      description,
      price,
      categoryId,
      creatorId,
    });
    res.status(201).json({ message: "Course created successfully", course });
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
    const courses = await Course.findAll({
      include: [
        { model: User, as: "creator", attributes: ["name"] },
        { model: Category, as: "category", attributes: ["name"] },
      ],
    });

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
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: User, as: "creator", attributes: ["name"] },
        { model: Category, as: "category", attributes: ["name"] },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
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
    const { title, description, price, categoryId, creatorId } = req.body;
    const courseId = req.params.id;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.categoryId = categoryId || course.categoryId;
    course.creatorId = creatorId || course.creatorId;

    await course.save();

    res.status(200).json({ message: "Course updated successfully", course });
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

    if (course.thumbnail) {
      const thumbnailPath = path.join("public", course.thumbnail);
      if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
    }

    await course.destroy();

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error.message);
    res
      .status(500)
      .json({ error: "Error deleting course", details: error.message });
  }
};

// Get courses by creator
exports.getCoursesByCreator = async (req, res) => {
  const { creatorId } = req.params;

  try {
    const courses = await Course.findAll({
      where: { creatorId },
      include: { model: Category, as: "category", attributes: ["name"] },
    });

    if (!courses.length) {
      return res
        .status(404)
        .json({ message: "No courses found for this creator" });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    res
      .status(500)
      .json({ error: "Error fetching courses", details: error.message });
  }
};

// Upload thumbnail for a course
exports.uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const courseId = req.params.id;
    const thumbnailPath = `/uploads/thumbnails/${req.file.filename}`;

    const course = await Course.findByPk(courseId);
    if (!course) {
      const uploadedFile = path.join("public", thumbnailPath);
      if (fs.existsSync(uploadedFile)) fs.unlinkSync(uploadedFile);

      return res.status(404).json({ error: "Course not found" });
    }

    if (course.thumbnail) {
      const existingThumbnail = path.join("public", course.thumbnail);
      if (fs.existsSync(existingThumbnail)) fs.unlinkSync(existingThumbnail);
    }

    course.thumbnail = thumbnailPath;
    await course.save();

    res.status(200).json({
      message: "Thumbnail uploaded successfully",
      thumbnail: thumbnailPath,
    });
  } catch (error) {
    console.error("Error uploading thumbnail:", error.message);
    res
      .status(500)
      .json({ error: "Error uploading thumbnail", details: error.message });
  }
};

// Delete thumbnail
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
    console.error("Error deleting thumbnail:", error.message);
    res
      .status(500)
      .json({ error: "Error deleting thumbnail", details: error.message });
  }
};
