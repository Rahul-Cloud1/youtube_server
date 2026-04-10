import express from "express";
import { registerUser, loginUser, updateUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateUserProfile);

router.get("/test",(req,res)=>{
  res.json({message:"Auth route working"});
});

export default router;