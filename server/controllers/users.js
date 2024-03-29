import User from "../models/User.js";
import Artist from "../models/Artist.js";

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
    // First, try to find the person as a User
    let person = await User.findById(id);
    // If not found as a User, try to find the person as an Artist
    if (!person) person = await Artist.findById(id);

    // If the person is not found as either a User or an Artist, return a 404 response
    if (!person) {
      return res.status(404).json({ message: "User/Artist not found" });
    }

    // Assuming that the 'friends' array contains IDs of both Users and Artists
    const friendsPromises = person.friends.map(async (friendId) => {
      // Attempt to find each friend as a User
      let friend = await User.findById(friendId);
      // If not found as a User, try to find the friend as an Artist
      if (!friend) friend = await Artist.findById(friendId);
      return friend;
    });

    // Resolve all promises and filter out any null values (friends not found)
    const friends = (await Promise.all(friendsPromises)).filter(friend => friend !== null);

    // Format the friends for the response
    const formattedFriends = friends.map(({ _id, username, scene, sceneName, location, picturePath }) => {
      return { _id, username, scene, sceneName, location, picturePath };
    });

    res.status(200).json(formattedFriends);
  } catch (err) {
    console.error("Error in getUserFriends:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    // First, try to find the person as a User
    let person = await User.findById(id);
    // If not found as a User, try to find the person as an Artist
    if (!person) person = await Artist.findById(id);

    // If the person is not found as either a User or an Artist, return a 404 response
    if (!person) {
      return res.status(404).json({ message: "User/Artist not found" });
    }

    // Assuming that the 'friends' array contains IDs of both Users and Artists
    const followersPromises = person.followers.map(async (followerId) => {
      // Attempt to find each friend as a User
      let follower = await User.findById(followerId);
      // If not found as a User, try to find the friend as an Artist
      if (!follower) follower = await Artist.findById(followerId);
      return follower;
    });

    // Resolve all promises and filter out any null values (friends not found)
    const followers = (await Promise.all(followersPromises)).filter(follower => follower !== null);

    // Format the friends for the response
    const formattedFollowers = followers.map(({ _id, username, scene, sceneName, location, picturePath }) => {
      return { _id, username, scene, sceneName, location, picturePath };
    });

    res.status(200).json(formattedFollowers);
  } catch (err) {
    console.error("Error in getUserFriends:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    // Attempt to find both user and artist for the given id and friendId
    let person = await User.findById(id);
    if (!person) person = await Artist.findById(id);

    let friend = await User.findById(friendId);
    if (!friend) friend = await Artist.findById(friendId);

    // Check if both entities were found
    if (!person || !friend) {
      return res.status(404).json({ message: "User/Artist not found" });
    }

    // The logic to add or remove friend
    const isFollowing = person.friends.includes(friendId);

    if (isFollowing) {
      // Remove friendId from person's friends
      person.friends = person.friends.filter(fid => fid.toString() !== friendId);
      // Remove id from friend's friends
      friend.followers = friend.friends.filter(fid => fid.toString() !== id);
    } else {
      // Add friendId to person's friends
      person.friends.push(friendId);
      // Add id to friend's friends
      friend.followers.push(id);
    }

    await person.save();
    await friend.save();

    // Re-fetch the updated friends list and filter out null values
    const updatedFriends = (await Promise.all(
      person.friends.map(async fid => {
        let friend = await User.findById(fid);
        if (!friend) {
          friend = await Artist.findById(fid);
        }
        return friend;
      })
    )).filter(friend => friend !== null);

    // Format the friends for response
    const formattedFriends = updatedFriends.map(friend => {
      const { _id, username, scene, sceneName, location, picturePath } = friend;
      return { _id, username, scene, sceneName, location, picturePath };
    });

    res.status(200).json(formattedFriends);
  } catch (err) {
    console.error("Error in addRemoveFriend:", err);
    res.status(500).json({ message: err.message });
  }
};
