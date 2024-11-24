const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapterController");

// Chapter CRUD routes
router.post("/", chapterController.createChapter); // Create a new chapter
router.get("/", chapterController.getAllChapters); // Get all chapters
router.get("/:id", chapterController.getChapterById); // Get a specific chapter by ID
router.put("/:id", chapterController.updateChapter); // Update a chapter
router.delete("/:id", chapterController.deleteChapter); // Delete a chapter

module.exports = router;
