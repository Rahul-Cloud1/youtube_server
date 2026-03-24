import express from "express";
import {
  getVideos,
  createVideo,
  deleteVideo,
  updateVideo,
  addView,
  likeVideo,
  dislikeVideo
} from "../controllers/videoController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVideos);
router.post("/", protect, createVideo);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);

router.put("/view/:id", addView);
router.put("/like/:id", protect, likeVideo);
router.put("/dislike/:id", protect, dislikeVideo);

export default router;