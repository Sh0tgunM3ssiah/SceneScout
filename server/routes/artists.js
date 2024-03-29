import express from "express";
import {
  getArtistById,
  getAllArtists,
  getArtistByUsername,
  getArtistFriends,
  addRemoveFriend
} from "../controllers/artists.js";

const router = express.Router();

/* READ */
router.get("/", getAllArtists);
router.get("/:id", getArtistById);
router.get("/username/:username", getArtistByUsername);
router.get("/:id/friends", getArtistFriends);

/* UPDATE */
router.patch("/:id/:friendId", addRemoveFriend);

export default router;
