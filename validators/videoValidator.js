export const validateVideo = (req, res, next) => {
  const {
    title,
    description,
    videoUrl,
    thumbnailUrl,
    category,
  } = req.body;

  // Required fields
  if (!title || !description || !videoUrl || !thumbnailUrl || !category) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Title validation
  if (title.length < 5) {
    return res.status(400).json({
      message: "Title must be at least 5 characters",
    });
  }

  // Description validation
  if (description.length < 10) {
    return res.status(400).json({
      message: "Description must be at least 10 characters",
    });
  }

  // URL validation (basic)
  const urlRegex = /^(https?:\/\/)/;

  if (!urlRegex.test(videoUrl)) {
    return res.status(400).json({
      message: "Invalid video URL",
    });
  }

  if (!urlRegex.test(thumbnailUrl)) {
    return res.status(400).json({
      message: "Invalid thumbnail URL",
    });
  }

  // Category validation (optional strict check)
  const allowedCategories = [
    "Music",
    "Education",
    "Gaming",
    "News",
    "Sports",
    "Technology",
  ];

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      message: "Invalid category selected",
    });
  }

  next();
};