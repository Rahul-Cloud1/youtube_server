import Video from "../models/Video.js";

// ✅ GET VIDEOS (Search + Filter + Pagination + Sorting)
export const getVideos = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10, sort } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    let videosQuery = Video.find(query);

    // 🔥 Sorting
    if (sort === "latest") {
      videosQuery = videosQuery.sort({ createdAt: -1 });
    } else if (sort === "popular") {
      videosQuery = videosQuery.sort({ views: -1 });
    } else {
      videosQuery = videosQuery.sort({ createdAt: -1 });
    }

    // 🔥 Pagination
    const skip = (page - 1) * limit;
    const total = await Video.countDocuments(query);
    videosQuery = videosQuery.skip(skip).limit(Number(limit));

    const videos = await videosQuery;

    res.status(200).json({
      videos,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET VIDEOS BY CHANNEL (for Channel Page)
export const getVideosByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    
    const videos = await Video.find({ channelId })
      .sort({ createdAt: -1 });

    res.status(200).json(videos);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE VIDEO
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CREATE VIDEO (Protected route)
export const createVideo = async (req, res) => {
  try {
    // Validation
    const { title, description, category, videoUrl, thumbnailUrl, channelName } = req.body;

    if (!title || !description || !videoUrl) {
      return res.status(400).json({
        message: "Title, description, and videoUrl are required",
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        message: "Title must be less than 100 characters",
      });
    }

    if (description.length > 5000) {
      return res.status(400).json({
        message: "Description must be less than 5000 characters",
      });
    }

    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category: category || "Music",
      channelName,
      uploader: req.user?.id,
      views: 0,
      likes: 0,
      dislikes: 0,
    });

    await video.save();

    res.status(201).json({
      message: "Video created successfully",
      video,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE VIDEO (Protected - only owner can update)
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Authorization check - only video uploader can update
    if (video.uploader.toString() !== req.user?.id) {
      return res.status(403).json({
        message: "You can only update your own videos",
      });
    }

    // Allow only specific fields to be updated
    const allowedFields = ["title", "description", "category", "thumbnailUrl"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Validation
    if (updateData.title && updateData.title.length > 100) {
      return res.status(400).json({
        message: "Title must be less than 100 characters",
      });
    }

    if (updateData.description && updateData.description.length > 5000) {
      return res.status(400).json({
        message: "Description must be less than 5000 characters",
      });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Video updated successfully",
      video: updatedVideo,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE VIDEO (Protected - only owner can delete)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Authorization check - only video uploader can delete
    if (video.uploader.toString() !== req.user?.id) {
      return res.status(403).json({
        message: "You can only delete your own videos",
      });
    }

    await video.deleteOne();

    res.status(200).json({
      message: "Video deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADD VIEW
export const addView = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ LIKE VIDEO (Better logic - toggle or increment)
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Simple increment for now (can be improved with user tracking)
    video.likes += 1;
    await video.save();

    res.json({
      message: "Video liked",
      video,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DISLIKE VIDEO (Better logic - toggle or increment)
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Simple increment for now (can be improved with user tracking)
    video.dislikes += 1;
    await video.save();

    res.json({
      message: "Video disliked",
      video,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
