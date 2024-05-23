import express from 'express';
import { createEvent, deleteEvent, getEvent, getEvents, getEventComments, postEventComment } from '../controllers/events.controller.js';
import fileUpload from 'express-fileupload'; // Middleware for handling file uploads
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(fileUpload({ useTempFiles: true })); // Add file upload middleware

router.post('/', protectRoute, createEvent); // Add createEvent route
router.get('/:sceneId', getEvents);
router.get('/event/:eventId', getEvent);
router.delete('/event/:eventId', protectRoute, deleteEvent);
router.get('/comments/:eventId', getEventComments);
router.post('/event/:eventId/comments', protectRoute, postEventComment);

export default router;
