import express from "express";
import {getComments,addComment,deleteComment} from "../controllers/commentController.js";

const router = express.Router();

router.get("/:videoId",getComments);
router.post("/",addComment);
router.delete("/:id",deleteComment);

export default router;