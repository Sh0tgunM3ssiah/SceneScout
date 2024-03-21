import express from "express";
import {
  getUserById,
  getUserByUsername,
  getUserByEmail,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";

const router = express.Router();

/* READ */
router.get("/:id", getUserById);
router.get("/email/:email", getUserByEmail);
router.get("/username/:username", getUserByUsername);
router.get("/:id/friends", getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", addRemoveFriend);

export default router;