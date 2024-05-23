// routes/classifieds.js
import express from 'express';
import {
    getClassifiedAds,
    getClassifiedAd,
    postClassifiedAd,
    getClassifiedAdComments,
    postClassifiedAdComment,
    deleteClassifiedAd
} from '../controllers/classifieds.controller.js';
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Get all ads for a scene
router.get('/:sceneId', getClassifiedAds);

// Get details of a specific ad
router.get('/ad/:adId', getClassifiedAd);

// Post a new ad
router.post('/', protectRoute, postClassifiedAd);

// Get all comments for an ad
router.get('/ad/:adId/comments', getClassifiedAdComments);

// Post a new comment on an ad
router.post('/ad/:adId/comments', protectRoute, postClassifiedAdComment);

router.delete('/ad/:adId', protectRoute, deleteClassifiedAd);

export default router;
