// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import User from '../models/User.js'; // Adjust the import path according to your project structure
import Artist from '../models/Artist.js'; // Adjust the import path according to your project structure

export const register = async (req, res) => {
  try {
    const {
      username,
      accountType, // assuming this is included in your request body
      firstName,
      lastName,
      artistName, // assuming ArtistName is provided for accountType 'Artist'
      email,
      picturePath,
      friends, // assuming this applies to Users
      location,
      genre, // assuming this applies to Artist
      members, // assuming this is a list of member IDs or names for Artists
      scene, // assuming this applies to Users
    } = req.body;

    if (accountType === 'User') {
      const newUser = new User({
        username,
        firstName,
        lastName,
        email,
        picturePath,
        friends,
        location,
        scene,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } else if (accountType === 'Artist') {
      const newArtist = new Artist({
        username,
        name: artistName, // Using Artist for the Artist's name
        email,
        picturePath,
        genre,
        members,
        location,
        scene,
        friends,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      });
      const savedArtist = await newArtist.save();
      res.status(201).json(savedArtist);
    } else {
      res.status(400).json({ error: 'Invalid account type' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
