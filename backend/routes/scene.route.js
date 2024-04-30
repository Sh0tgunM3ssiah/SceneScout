import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getAllScenes, getScene, getSceneByName } from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", getAllScenes);
router.get("/:id", getScene);
router.get("/scene/:name", getSceneByName);

export default router;
