// controllers/classifiedsController.js
import ClassifiedAd from '../models/classifiedAd.model.js';
import ClassifiedAdComment from '../models/classifiedAdComment.model.js';

// Get all ads for a scene
export const getClassifiedAds = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const sceneId = req.params.sceneId;

    try {
        const totalAds = await ClassifiedAd.countDocuments({ sceneId });
        const ads = await ClassifiedAd.find({ sceneId })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            ads,
            currentPage: Number(page),
            totalPages: Math.ceil(totalAds / limit),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get details of a specific ad
export const getClassifiedAd = async (req, res) => {
    try {
        const ad = await ClassifiedAd.findById(req.params.adId);
        res.status(200).json(ad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Post a new ad
export const postClassifiedAd = async (req, res) => {
    const { sceneId, userId, username, title, description } = req.body;
    const ad = new ClassifiedAd({ sceneId, userId, username, title, description });

    try {
        const savedAd = await ad.save();
        res.status(201).json(savedAd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all comments for an ad
export const getClassifiedAdComments = async (req, res) => {
    try {
        const comments = await ClassifiedAdComment.find({ adId: req.params.adId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Post a new comment on an ad
export const postClassifiedAdComment = async (req, res) => {
    const { adId, userId, username, content } = req.body;
    const comment = new ClassifiedAdComment({ adId, userId, username, content });

    try {
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteClassifiedAd = async (req, res) => {
    try {
        const ad = await ClassifiedAd.findById(req.params.adId);

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (ad.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this ad' });
        }

        await ClassifiedAdComment.deleteMany({ adId: ad._id });
        await ClassifiedAd.findByIdAndDelete(req.params.adId);

        res.status(200).json({ message: 'Ad and associated comments deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};