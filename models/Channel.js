import mongoose from "mongoose";

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

  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    }
  ]

}, { timestamps: true });

// Virtual populate
channelSchema.virtual("videoList", {
  ref: "Video",
  localField: "_id",
  foreignField: "channelId"
});

channelSchema.set("toObject", { virtuals: true });
channelSchema.set("toJSON", { virtuals: true });

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;