import express from "express";
import { getFeedEvents, getUserEvents, likeEvent } from "../controllers/events.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getFeedEvents);
router.get("/:userId/events", getUserEvents);

/* UPDATE */
router.patch("/:id/like", likeEvent);

export default router;
