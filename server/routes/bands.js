import express from "express";
import {
  getBandById,
  getAllBands,
  getBandByUsername,
} from "../controllers/bands.js";

const router = express.Router();

/* READ */
router.get("/", getAllBands);
router.get("/:id", getBandById);
router.get("/username/:username", getBandByUsername);

export default router;
