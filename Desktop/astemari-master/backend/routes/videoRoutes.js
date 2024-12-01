const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

// Video CRUD routes
router.post("/", videoController.createVideo); // Create a new video
router.get("/", videoController.getAllVideos); // Get all videos
router.get("/:id", videoController.getVideoById); // Get a specific video by ID
router.put("/:id", videoController.updateVideo); // Update a video
router.delete("/:id", videoController.deleteVideo); // Delete a video

module.exports = router;
