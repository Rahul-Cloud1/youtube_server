import Video from "../models/Video.js";

// ✅ GET VIDEOS (Search + Filter + Pagination + Sorting)
export const getVideos = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10, sort } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    let videosQuery = Video.find(query);

    // 🔥 Sorting
    if (sort === "latest") {
      videosQuery = videosQuery.sort({ createdAt: -1 });
    } else if (sort === "popular") {
      videosQuery = videosQuery.sort({ views: -1 });
    }

    // 🔥 Pagination
    const skip = (page - 1) * limit;
    videosQuery = videosQuery.skip(skip).limit(Number(limit));

    const videos = await videosQuery;

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
    const video = new Video({
      ...req.body,
      uploader: req.user?.id, // from auth middleware
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

// ✅ DELETE VIDEO (Protected)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    await video.deleteOne();

    res.status(200).json({
      message: "Video deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE VIDEO (IMPORTANT for CRUD)
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);

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

// ✅ LIKE VIDEO
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
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

// ✅ DISLIKE VIDEO
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: 1 } },
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
