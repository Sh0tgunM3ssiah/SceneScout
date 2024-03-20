import Band from "../models/Band.js";

/* READ */
export const getBandById = async (req, res) => {
  try {
    const { id } = req.params;
    const band = await Band.findById(id);
    res.status(200).json(band);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllBands = async (req, res) => {
  try {
      const bands = await Band.find();
      if (bands.length > 0) {
          res.status(200).json(bands);
      } else {
          // Handle the case where no scenes are found
          res.status(404).json({ message: "No Bands found" });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

export const getBandByUsername = async (req, res) => {
  // Extract the email path parameter from req.params
  let username = req.params.username;
  
  if (username) {
    username = decodeURIComponent(username); // Decode the email if it's URL-encoded
  } else {
      // Handle the case where email path parameter is not provided
      return res.status(400).json({ message: "Username path parameter is required." });
  }

  try {
      const band = await Band.findOne({ username: username });
      if (band) {
          res.status(200).json(band);
      } else {
          res.status(404).json({ message: "Band not found" });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};
