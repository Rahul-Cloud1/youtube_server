import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  videoUrl: {
    type: String,
    required: true,
  },

  thumbnailUrl: {
    type: String,
    required: true,
  },

  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },

  category: {
  type: String,
  required: true,
  default: "General"
},
  views: {
    type: Number,
    default: 0,
  },

  likes: {
    type: Number,
    default: 0,
  },

  dislikes: {
    type: Number,
    default: 0,
  }

}, { timestamps: true });
videoSchema.index({ title: "text" });

export default mongoose.model("Video", videoSchema);