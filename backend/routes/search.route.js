// File: routes/search.routes.js
import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { searchItems } from "../controllers/search.controller.js";

const router = express.Router();

router.get('/', protectRoute, searchItems);

export default router;
