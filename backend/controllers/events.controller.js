import Event from '../models/event.model.js';
import EventComment from '../models/eventComment.model.js';
import { v2 as cloudinary } from "cloudinary";

// Get all events for a scene
export const getEvents = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const sceneId = req.params.sceneId;

    try {
        const totalEvents = await Event.countDocuments({ sceneId });
        const events = await Event.find({ sceneId })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            events,
            currentPage: Number(page),
            totalPages: Math.ceil(totalEvents / limit),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get details of a specific event
export const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Post a new event
export const createEvent = async (req, res) => {
    try {
        const { user, username, title, location, description, artists, genre, url, sceneId, sceneName, userSceneName, userSceneId, eventDate, eventTime } = req.body;
        let picture = req.body.picture;

        if (!title || !location || !description || !artists || !genre) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (picture) {
            const uploadedResponse = await cloudinary.uploader.upload(picture);
            picture = uploadedResponse.secure_url;
        }

        const newEvent = new Event({
            user,
            username,
            title,
            picture,
            location,
            description,
            artists: JSON.parse(artists),
            genre,
            url,
            sceneId,
            sceneName,
            userSceneId,
            userSceneName,
            eventDate,
            eventTime
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in createEvent controller: ", error);
    }
};

export const getEventComments = async (req, res) => {
    try {
        const comments = await EventComment.find({ eventId: req.params.eventId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Post a new comment on an event
export const postEventComment = async (req, res) => {
    const { eventId, userId, username, content } = req.body;
    const comment = new EventComment({ eventId, userId, username, content });

    try {
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        // Ensure req.user is defined
        if (!req.user || !req.user._id) {
            console.error('User not authenticated');
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }

        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (!event.user) {
            console.error('Event userId is undefined');
            return res.status(403).json({ message: 'Event userId is undefined' });
        }

        if (event.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }

        await EventComment.deleteMany({ eventId: event._id });
        await Event.findByIdAndDelete(req.params.eventId);

        res.status(200).json({ message: 'Event and associated comments deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: error.message });
    }
};