import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const searchItems = async (req, res) => {
    const { scene, searchType, userType, genre, postType } = req.query;

    try {
        let results = [];
        if (searchType === 'users') {
            const query = { sceneId: scene };
            if (userType) query.userType = userType;
            if (genre && userType === 'artist') query.genre = genre;

            results = await User.find(query).select('-password');
        } else if (searchType === 'posts') {
            const query = { sceneId: scene };

            results = await Post.find(query).populate('user', '-password');
        }

        res.status(200).json(results);
    } catch (error) {
        console.log("Error in searchItems: ", error);
        res.status(500).json({ error: error.message });
    }
};