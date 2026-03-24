import express from "express";
import {
  createChannel,
  getChannel,
  getChannelVideos,
  updateChannel,
  deleteChannel,
  toggleSubscribe
} from "../controllers/channelController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createChannel);
router.get("/:id", getChannel);
router.get("/:id/videos", getChannelVideos);

router.put("/:id", protect, updateChannel);
router.delete("/:id", protect, deleteChannel);

// 🔥 Subscribe feature
router.put("/subscribe/:id", protect, toggleSubscribe);

export default router;