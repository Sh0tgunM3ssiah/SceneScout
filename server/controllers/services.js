import Scene from "../models/Scene.js";
import Genre from "../models/Genre.js";
import SubGenre from "../models/Genre.js";

/* READ */
export const getScene = async (req, res) => {
  try {
    const { id } = req.params;
    const scene = await Scene.findById(id);
    res.status(200).json(scene);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllScenes = async (req, res) => {
  try {
      const scenes = await Scene.find();
      if (scenes.length > 0) {
          res.status(200).json(scenes);
      } else {
          // Handle the case where no scenes are found
          res.status(404).json({ message: "No scenes found" });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

export const getGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const genre = await Genre.findById(id);
    res.status(200).json(genre);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllGenres = async (req, res) => {
  try {
    const genresWithSubGenres = await Genre.aggregate([
      {
        $lookup: {
          from: "subgenres", // This should be the actual name of the collection in your MongoDB. Use the collection name, not the model name.
          localField: "genreId",
          foreignField: "parentId",
          as: "subGenres",
        },
      },
      {
        $project: {
          name: 1,
          genreId: 1,
          subGenres: {
            name: 1,
            parentId: 1,
          },
        },
      },
    ]);

    if (genresWithSubGenres.length > 0) {
      res.status(200).json(genresWithSubGenres);
    } else {
      res.status(404).json({ message: "No genres found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getSceneByName = async (req, res) => {
  // Extract the email path parameter from req.params
  let sceneName = req.params.sceneName;
  
  if (sceneName) {
    sceneName = decodeURIComponent(sceneName); // Decode the email if it's URL-encoded
  } else {
      // Handle the case where email path parameter is not provided
      return res.status(400).json({ message: "Username path parameter is required." });
  }

  try {
      const scene = await Scene.findOne({ name: sceneName }); // Use findOne to find the user by email
      if (scene) {
          res.status(200).json(scene);
      } else {
          res.status(404).json({ message: "User not found" });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};
