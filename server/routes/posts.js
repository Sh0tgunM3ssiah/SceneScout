import express from "express";
import { getFeedPosts, getUserPosts, likePost, deletePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);

router.delete('/:id/delete', deletePost);

/* UPDATE */
router.patch("/:id/like", likePost);

export default router;
