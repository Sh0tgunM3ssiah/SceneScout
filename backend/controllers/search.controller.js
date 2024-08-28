import User from "../models/user.model.js";
import Event from "../models/event.model.js";

export const searchItems = async (req, res) => {
    const { scene, searchType, userType, genre, startDate, endDate, page = 1, limit = 20 } = req.query;

    try {
        let results = [];
        const skip = (page - 1) * limit;

        // Initialize the query object
        let query = { sceneId: scene };

        if (searchType === 'users') {
            if (userType) query.userType = userType;
            if (genre && userType === 'artist') query.genre = genre;

            results = await User.find(query).select('-password').skip(skip).limit(Number(limit));
        } else if (searchType === 'events') {
            if (startDate) query.eventDate = { $gte: startDate };
            if (endDate) query.eventDate = { ...query.eventDate, $lte: endDate };

            results = await Event.find(query).skip(skip).limit(Number(limit));
        }

        const totalResults = await (searchType === 'users' ? User.countDocuments(query) : Event.countDocuments(query));
        const totalPages = Math.ceil(totalResults / limit);

        res.status(200).json({ results, totalPages });
    } catch (error) {
        console.log("Error in searchItems: ", error);
        res.status(500).json({ error: error.message });
    }
};
