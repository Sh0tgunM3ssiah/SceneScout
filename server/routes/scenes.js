import express from "express";
import {
  getScene,
  getSceneByName,
  getAllScenes,
} from "../controllers/scenes.js";

const router = express.Router();

/* READ */
router.get("/", getAllScenes);
router.get("/:id", getScene);
router.get("/scene/:name", getSceneByName);

export default router;
