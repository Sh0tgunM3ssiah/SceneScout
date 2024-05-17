// routes/classifieds.js
import express from 'express';
import {
    getClassifiedAds,
    getClassifiedAd,
    postClassifiedAd,
    getClassifiedAdComments,
    postClassifiedAdComment
} from '../controllers/classifieds.controller.js';

const router = express.Router();

// Get all ads for a scene
router.get('/:sceneId', getClassifiedAds);

// Get details of a specific ad
router.get('/ad/:adId', getClassifiedAd);

// Post a new ad
router.post('/', postClassifiedAd);

// Get all comments for an ad
router.get('/ad/:adId/comments', getClassifiedAdComments);

// Post a new comment on an ad
router.post('/ad/:adId/comments', postClassifiedAdComment);

export default router;
