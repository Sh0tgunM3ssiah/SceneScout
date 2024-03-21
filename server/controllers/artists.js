import Artist from "../models/Artist.js";

/* READ */
export const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id);
    res.status(200).json(artist);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllArtists = async (req, res) => {
  try {
      const artist = await Artist.find();
      if (artists.length > 0) {
          res.status(200).json(artists);
      } else {
          // Handle the case where no scenes are found
          res.status(404).json({ message: "No Artists found" });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

export const getArtistByUsername = async (req, res) => {
  // Extract the email path parameter from req.params
  let username = req.params.username;
  
  if (username) {
    username = decodeURIComponent(username); // Decode the email if it's URL-encoded
  } else {
      // Handle the case where email path parameter is not provided
      return res.status(400).json({ message: "Username path parameter is required." });
  }

  try {
      const artist = await Artist.findOne({ username: username });
      if (artist) {
          res.status(200).json(artist);
      } else {
          res.status(404).json({ message: "Artist not found" });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};
