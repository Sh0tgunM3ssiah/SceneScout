import Event from "../models/Event.js";
import User from "../models/User.js";

/* CREATE */
export const createEvent = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newEvent = new Event({
      userId,
      username,
      sceneId,
      eventName,
      venueName,
      location,
      description,
      picturePath,
      bands,
      genres,
      ticketLink,
      facebookLink,
      likes: {},
      comments: [],
    });
    await newEvent.save();

    const event = await Event.find();
    res.status(201).json(event);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedEvents = async (req, res) => {
  try {
    let query = {}; // Initialize an empty query object

    // Check if sceneId is provided in the query params
    if (req.query.sceneId) {
      // Update the query to filter by sceneId
      query.sceneId = req.query.sceneId;
    }

    // Use the query object in your find method
    const events = await Event.find(query);
    res.status(200).json(events);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    const event = await Event.find({ userId });
    res.status(200).json(event);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likeEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const event = await Event.findById(id);
    const isLiked = event.likes.get(userId);

    if (isLiked) {
      event.likes.delete(userId);
    } else {
      event.likes.set(userId, true);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { likes: event.likes },
      { new: true }
    );

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
