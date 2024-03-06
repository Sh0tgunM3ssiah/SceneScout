import express from "express";
import {
  getUser,
  getUserByUsername,
  getUserByEmail,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";

const router = express.Router();

/* READ */
router.get("/:id", getUser);
router.get("/email/:email", getUserByEmail);
router.get("/username/:username", getUserByUsername);
router.get("/:id/friends", getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", addRemoveFriend);

export default router;
