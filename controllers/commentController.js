import Comment from "../models/Comment.js";

// ✅ GET COMMENTS (latest first)
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      videoId: req.params.videoId,
    })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ ADD COMMENT (Protected)
export const addComment = async (req, res) => {
  try {
    const { text, videoId } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const comment = new Comment({
      text,
      videoId,
      userId: req.user.id, // 🔥 link user
    });

    await comment.save();

    res.status(201).json({
      message: "Comment added",
      comment,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ UPDATE COMMENT (VERY IMPORTANT)
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Optional: check ownership
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    comment.text = req.body.text || comment.text;

    await comment.save();

    res.status(200).json({
      message: "Comment updated",
      comment,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ DELETE COMMENT (Protected + Ownership check)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // 🔥 Only owner can delete
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comment deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};