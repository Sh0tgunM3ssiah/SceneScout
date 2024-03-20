import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  // Extract the email path parameter from req.params
  let userId = req.params.id;
  
  if (userId) {
    userId = decodeURIComponent(userId); // Decode the email if it's URL-encoded
  } else {
      // Handle the case where email path parameter is not provided
      return res.status(400).json({ message: "userId path parameter is required." });
  }


  try {
      const user = await User.findOne({ userId: userId }); // Use findOne to find the user by email
      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).json({ message: "User not found" });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

export const getUserByUsername = async (req, res) => {
  // Extract the email path parameter from req.params
  let username = req.params.username;
  
  if (username) {
    username = decodeURIComponent(username); // Decode the email if it's URL-encoded
  } else {
      // Handle the case where email path parameter is not provided
      return res.status(400).json({ message: "Username path parameter is required." });
  }


  try {
      const user = await User.findOne({ username: username }); // Use findOne to find the user by email
      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).json({ message: "User not found" });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

export const getUserByEmail = async (req, res) => {
  // Extract the email path parameter from req.params
  let email = req.params.email;
  
  if (email) {
      email = decodeURIComponent(email); // Decode the email if it's URL-encoded
  } else {
      // Handle the case where email path parameter is not provided
      return res.status(400).json({ message: "Email path parameter is required." });
  }

  try {
      const user = await User.findOne({ email: email }); // Use findOne to find the user by email
      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).json({ message: "User not found" });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
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
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
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
