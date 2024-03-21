import express from "express";
import {
  getArtistById,
  getAllArtists,
  getArtistByUsername,
} from "../controllers/artists.js";

const router = express.Router();

/* READ */
router.get("/", getAllArtists);
router.get("/:id", getArtistById);
router.get("/username/:username", getArtistByUsername);

export default router;
