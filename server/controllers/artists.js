import User from "../models/User.js";
import Artist from "../models/Artist.js";

/* READ */
export const getArtistById = async (req, res) => {
  let userId = req.params.id;
  
  if (userId) {
    userId = decodeURIComponent(userId); // Decode the email if it's URL-encoded
  } else {
      // Handle the case where email path parameter is not provided
      return res.status(400).json({ message: "userId path parameter is required." });
  }

  try {
      const artist = await Artist.findOne({ userId: userId });
      if (artist) {
          res.status(200).json(artist);
      } else {
          res.status(404).json({ message: "Artist not found" });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
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

export const getArtistFriends = async (req, res) => {
    try {
      const { id } = req.params;
      const artist = await Artist.findById(id);
  
      const friends = await Promise.all(
        artist.friends.map((id) => Artist.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
  /* UPDATE */
  export const addRemoveFriend = async (req, res) => {
    const { id, friendId } = req.params;
      console.log(`Updating friend relation between: ${id} and ${friendId}`);
    try {
  
      // Attempt to find both user and artist for the given id and friendId
      const person = await User.findById(id) || await Artist.findById(id);
      const friend = await User.findById(friendId) || await Artist.findById(friendId);
  
      // Check if both entities were found
      if (!person || !friend) {
        return res.status(404).json({ message: "User/Artist not found" });
      }
  
      // The logic to add or remove friend
      const isFriend = person.friends.includes(friendId);
  
      if (isFriend) {
        // Remove friendId from person's friends
        person.friends = person.friends.filter((fid) => fid.toString() !== friendId);
        // Remove id from friend's friends
        friend.friends = friend.friends.filter((fid) => fid.toString() !== id);
      } else {
        // Add friendId to person's friends
        person.friends.push(friendId);
        // Add id to friend's friends
        friend.friends.push(id);
      }
  
      await person.save();
      await friend.save();
  
      // Re-fetch the updated friends list
      const updatedFriends = await Promise.all(
        person.friends.map((fid) => User.findById(fid) || Artist.findById(fid))
      );
  
      // Format the friends for response
      const formattedFriends = updatedFriends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      });
  
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
