import express from "express";
import { getAllScenes, getAllGenres } from "../controllers/services.js";

const router = express.Router();

/* READ */
router.get("/scenes", getAllScenes);
router.get("/genres", getAllGenres);

export default router;
