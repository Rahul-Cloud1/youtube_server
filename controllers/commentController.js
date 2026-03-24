import Comment from "../models/Comment.js";

export const getComments = async(req,res)=>{

  const comments = await Comment.find({
    videoId:req.params.videoId
  });

  res.json(comments);

};

export const addComment = async(req,res)=>{

  const comment = new Comment(req.body);

  await comment.save();

  res.json(comment);

};

export const deleteComment = async(req,res)=>{

  await Comment.findByIdAndDelete(req.params.id);

  res.json("Comment deleted");

};