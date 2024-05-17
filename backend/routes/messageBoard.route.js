import express from 'express';
import Message from '../models/messageBoardMessage.model.js';

const router = express.Router();

// Get messages by sceneId
router.get('/:sceneId', async (req, res) => {
    try {
        // Calculate the date 14 days ago from now
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        // Find messages by sceneId, filter by date, sort by creation date, and limit to 500
        const messages = await Message.find({ 
            sceneId: req.params.sceneId, 
            createdAt: { $gte: fourteenDaysAgo } 
        })
        .populate('userId', 'username')
        .sort({ createdAt: -1 }) // Sort by creation date descending
        .limit(500);

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Post a new message
router.post('/', async (req, res) => {
    const { sceneId, userId, username, content } = req.body;
    const message = new Message({ sceneId, userId, username, content });

    try {
        const savedMessage = await message.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
