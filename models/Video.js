import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String
  },
  videoUrl:{
    type:String,
    required:true
  },
  thumbnail:{
    type:String
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  views:{
    type:Number,
    default:0
  }
},{timestamps:true});

export default mongoose.model("Video",videoSchema);