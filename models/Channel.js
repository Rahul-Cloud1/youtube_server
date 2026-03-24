import mongoose from "mongoose";
channelSchema.virtual("videoList", {
  ref: "Video",
  localField: "_id",
  foreignField: "channelId"
});

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  description: String,

  banner: String,

  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  subscribersCount: {
  type: Number,
  default: 0
},

  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    }
  ]

}, { timestamps: true });
Channel.findById(id).populate("videoList");

export default mongoose.model("Channel", channelSchema);