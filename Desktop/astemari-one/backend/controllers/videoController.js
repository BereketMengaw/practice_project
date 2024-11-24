const Video = require("../models/Video");

// Create a new video
exports.createVideo = async (req, res) => {
  try {
    const { title, url, chapterId, order } = req.body;

    // Validate input
    if (!title || !url || !chapterId) {
      return res.status(400).json({
        error: "Title, URL, and Chapter ID are required.",
      });
    }

    const video = await Video.create({ title, url, chapterId, order });
    res.status(201).json(video);
  } catch (error) {
    console.error("Error creating video:", error.message);
    res.status(500).json({
      error: "Error creating video",
      details: error.message,
    });
  }
};

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll();
    if (!videos.length) {
      return res.status(404).json({ message: "No videos found" });
    }
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error.message);
    res.status(500).json({
      error: "Error fetching videos",
      details: error.message,
    });
  }
};

// Get video by ID
exports.getVideoById = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findByPk(videoId);

    if (video) {
      res.status(200).json(video);
    } else {
      res.status(404).json({ error: "Video not found" });
    }
  } catch (error) {
    console.error("Error fetching video:", error.message);
    res.status(500).json({
      error: "Error fetching video",
      details: error.message,
    });
  }
};

// Update video by ID
exports.updateVideo = async (req, res) => {
  try {
    const { title, url, chapterId, order } = req.body;
    const videoId = req.params.id;

    // Validate input
    if (!title && !url && !chapterId && !order) {
      return res.status(400).json({
        error: "At least one field is required to update.",
      });
    }

    const video = await Video.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Update fields
    video.title = title || video.title;
    video.url = url || video.url;
    video.chapterId = chapterId || video.chapterId;
    video.order = order || video.order;

    await video.save();
    res.status(200).json(video);
  } catch (error) {
    console.error("Error updating video:", error.message);
    res.status(500).json({
      error: "Error updating video",
      details: error.message,
    });
  }
};

// Delete video by ID
exports.deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    await video.destroy();
    res
      .status(200)
      .json({ message: `Video with ID ${videoId} has been deleted.` });
  } catch (error) {
    console.error("Error deleting video:", error.message);
    res.status(500).json({
      error: "Error deleting video",
      details: error.message,
    });
  }
};
