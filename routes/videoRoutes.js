import express from "express";
import {
  getVideos,
  getVideoById,
  getVideosByChannel,
  createVideo,
  deleteVideo,
  updateVideo,
  addView,
  likeVideo,
  dislikeVideo
} from "../controllers/videoController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📺 PUBLIC ROUTES
router.get("/", getVideos);
router.get("/channel/:channelId", getVideosByChannel);

// 🎯 PROTECTED ROUTES (must come after specific routes to avoid conflicts)
router.post("/", protect, createVideo);
router.put("/like/:id", protect, likeVideo);
router.put("/dislike/:id", protect, dislikeVideo);
router.put("/view/:id", addView);

// 📝 SINGLE VIDEO ROUTES (generic patterns - must come last)
router.get("/:id", getVideoById);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);

export default router;