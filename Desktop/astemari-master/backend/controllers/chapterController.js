const Chapter = require("../models/Chapter");

// Create a new chapter
exports.createChapter = async (req, res) => {
  try {
    // Validate incoming data
    const { title, courseId, order } = req.body;
    if (!title || !courseId || !order) {
      return res
        .status(400)
        .json({ error: "Title, courseId, and order are required" });
    }

    // Create chapter
    const chapter = await Chapter.create(req.body);
    res.status(201).json(chapter);
  } catch (error) {
    console.error("Error creating chapter:", error.message);
    res.status(500).json({
      error: "Error creating chapter",
      details: error.message,
    });
  }
};

// Get all chapters
exports.getAllChapters = async (req, res) => {
  try {
    const chapters = await Chapter.findAll();
    if (!chapters.length) {
      return res.status(404).json({ message: "No chapters found" });
    }
    res.status(200).json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error.message);
    res.status(500).json({
      error: "Error fetching chapters",
      details: error.message,
    });
  }
};

// Get a chapter by ID
exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findByPk(req.params.id);
    if (chapter) {
      res.status(200).json(chapter);
    } else {
      res.status(404).json({ message: "Chapter not found" });
    }
  } catch (error) {
    console.error("Error fetching chapter:", error.message);
    res.status(500).json({
      error: "Error fetching chapter",
      details: error.message,
    });
  }
};

// Update a chapter by ID
exports.updateChapter = async (req, res) => {
  try {
    const { title, courseId, order } = req.body;

    // Validate incoming data
    if (!title && !courseId && !order) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });
    }

    const chapterId = req.params.id;

    // Find the chapter
    const chapter = await Chapter.findByPk(chapterId);
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    // Update chapter
    chapter.title = title || chapter.title;
    chapter.courseId = courseId || chapter.courseId;
    chapter.order = order || chapter.order;

    await chapter.save();

    // Return updated chapter
    res.status(200).json(chapter);
  } catch (error) {
    console.error("Error updating chapter:", error.message);
    res.status(500).json({
      error: "Error updating chapter",
      details: error.message,
    });
  }
};

// Delete a chapter by ID
exports.deleteChapter = async (req, res) => {
  try {
    const chapterId = req.params.id;

    // Find the chapter
    const chapter = await Chapter.findByPk(chapterId);
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    // Delete chapter
    await chapter.destroy();
    res
      .status(200)
      .json({ message: `Chapter with ID ${chapterId} has been deleted` });
  } catch (error) {
    console.error("Error deleting chapter:", error.message);
    res.status(500).json({
      error: "Error deleting chapter",
      details: error.message,
    });
  }
};

//for selected

// Get chapters by course ID
exports.getChaptersByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Validate courseId
    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    // Get all chapters for the specified course
    const chapters = await Chapter.findAll({
      where: { courseId: courseId },
      order: [["order", "ASC"]], // Order chapters based on the "order" field (optional)
    });

    if (!chapters.length) {
      return res
        .status(404)
        .json({ message: "No chapters found for this course" });
    }

    res.status(200).json(chapters);
  } catch (error) {
    console.error("Error fetching chapters by course ID:", error.message);
    res.status(500).json({
      error: "Error fetching chapters",
      details: error.message,
    });
  }
};
