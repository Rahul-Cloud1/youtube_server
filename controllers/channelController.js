import Channel from "../models/Channel.js";
import Video from "../models/Video.js";

// ✅ CREATE CHANNEL (Protected)
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, banner } = req.body;

    if (!channelName) {
      return res.status(400).json({
        message: "Channel name is required",
      });
    }

    // Check if user already has a channel
    const existingChannel = await Channel.findOne({
      owner: req.user.id,
    });

    if (existingChannel) {
      return res.status(400).json({
        message: "You already have a channel",
      });
    }

    const channel = new Channel({
      channelName,
      description,
      banner,
      owner: req.user.id,
    });

    await channel.save();

    res.status(201).json({
      message: "Channel created successfully",
      channel,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ GET CHANNEL BY ID
export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    res.status(200).json(channel);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ GET CHANNEL VIDEOS
export const getChannelVideos = async (req, res) => {
  try {
    const videos = await Video.find({
      channelId: req.params.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(videos);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ UPDATE CHANNEL (Only Owner)
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    // 🔥 Ownership check
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    channel.channelName = req.body.channelName || channel.channelName;
    channel.description = req.body.description || channel.description;
    channel.banner = req.body.banner || channel.banner;

    await channel.save();

    res.status(200).json({
      message: "Channel updated",
      channel,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ DELETE CHANNEL (Only Owner)
export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await channel.deleteOne();

    res.status(200).json({
      message: "Channel deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ SUBSCRIBE / UNSUBSCRIBE CHANNEL
export const toggleSubscribe = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    const userId = req.user.id;

    // Assume channel has subscribers array
    if (!channel.subscribers) {
      channel.subscribers = [];
    }

    const isSubscribed = channel.subscribers.includes(userId);

    if (isSubscribed) {
      // Unsubscribe
      channel.subscribers = channel.subscribers.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Subscribe
      channel.subscribers.push(userId);
    }

    await channel.save();

    res.status(200).json({
      message: isSubscribed ? "Unsubscribed" : "Subscribed",
      subscribersCount: channel.subscribers.length,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};