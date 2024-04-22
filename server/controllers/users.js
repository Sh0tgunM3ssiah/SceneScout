import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import Artist from "../models/Artist.js";
import Post from "../models/Post.js";
import { BlobServiceClient } from "@azure/storage-blob";

const account = process.env.ACCOUNT_NAME;
const sas = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);
const containerClient = blobServiceClient.getContainerClient(containerName);

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
  let userId = req.params.id;

  // Decode the userId if it's URL-encoded
  if (userId) {
    userId = decodeURIComponent(userId);
  } else {
    // Handle the case where userId path parameter is not provided
    return res.status(400).json({ message: "userId path parameter is required." });
  }

  try {
    // First attempt to find the user
    let entity = await User.findOne({ userId: userId });
    let entityType = 'user'; // Default assumption

    // If no user found, try finding an artist
    if (!entity) {
      entity = await Artist.findOne({ userId: userId });
      entityType = 'artist';
    }

    // Check if any entity was found
    if (entity) {
      // You could optionally add a type field to the entity object to indicate whether it's a user or an artist
      const responseEntity = { ...entity._doc, type: entityType };
      res.status(200).json(responseEntity);
    } else {
      res.status(404).json({ message: "Entity not found" });
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
    const formattedFriends = friends.map(({ _id, userId, username, scene, sceneName, location, picturePath }) => {
      return { _id, userId, username, scene, sceneName, location, picturePath };
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
    const formattedFollowers = followers.map(({ _id, userId, username, scene, sceneName, location, picturePath }) => {
      return { _id, userId, username, scene, sceneName, location, picturePath };
    });

    res.status(200).json(formattedFollowers);
  } catch (err) {
    console.error("Error in getUserFollowes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsersByScene = async (req, res) => {
  const { sceneId } = req.params; // Get sceneId from request parameters

  console.log(sceneId);

  if (!sceneId) {
    return res.status(400).json({ message: "Scene ID parameter is required." });
  }

  try {
    // Use Promise.all to perform both queries in parallel
    const [users, artists] = await Promise.all([
      User.find({ scene: sceneId }),  // Find all users with the given sceneId
      Artist.find({ scene: sceneId }) // Find all artists with the same sceneId
    ]);

    // Combine the results from both queries
    const combinedResults = [...users, ...artists].map(entity => ({
      _id: entity._id,
      userId: entity.userId,
      username: entity.username || entity.name, // Handle username for Users and name for Artists
      scene: entity.scene,
      sceneName: entity.sceneName,
      location: entity.location,
      picturePath: entity.picturePath,
      type: entity instanceof User ? 'User' : 'Artist', // Distinguish between User and Artist
      genre: entity instanceof Artist ? entity.genre : undefined
    }));

    res.status(200).json(combinedResults);
  } catch (err) {
    console.error("Error in getUsersByScene:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
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
      const { _id, userId, username, scene, sceneName, location, picturePath } = friend;
      return { _id, userId, username, scene, sceneName, location, picturePath };
    });

    res.status(200).json(formattedFriends);
  } catch (err) {
    console.error("Error in addRemoveFriend:", err);
    res.status(500).json({ message: err.message });
  }
};

// This function should be defined in your controllers/users.js
export const editUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Initially consider the entity as a User
    let entity = await User.findById(id);
    let accountType = 'User';
    
    // If not found, then consider the entity as an Artist
    if (!entity) {
      entity = await Artist.findById(id);
      accountType = 'Artist';
    }

    if (!entity) {
      return res.status(404).json({ message: "User/Artist not found" });
    }

    // For Artist, use 'name' from req.body or entity.name, else use 'displayName'
    const newNameOrDisplayName = accountType === 'Artist' ? (req.body.name || entity.name) : (req.body.displayName || entity.displayName);

    let picturePath = entity.picturePath; // Keep existing picturePath by default
    if (req.file) {
      // Generate new image path
      picturePath = `https://${process.env.ACCOUNT_NAME}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${req.file.blobName}`;
      
      // Delete old image from Azure Blob Storage if it exists
      if (entity.picturePath) {
        const parts = entity.picturePath.split('/');
        const partialPath = parts.slice(3).join('/');
        const existingBlobName = partialPath.startsWith('blobby/') ? partialPath.substring('blobby/'.length) : partialPath;

        try {
          await containerClient.deleteBlob(existingBlobName);
        } catch (error) {
          console.error(`Failed to delete existing blob: ${existingBlobName}`, error);
        }
      }
      
      // Update the entity's picturePath
      entity.picturePath = picturePath;
    }

    // Apply other updates
    Object.keys(req.body).forEach(key => {
      if (key === 'displayName' && accountType === 'Artist') {
        // If the account is an Artist and key is displayName, update name instead
        entity['name'] = req.body[key];
      } else if (key in entity) {
        // For all other cases, update the entity directly
        entity[key] = req.body[key];
      }
    });

    await entity.save();

    // Update posts with new picturePath and username/displayName
    await Post.updateMany(
      { userId: entity._id }, 
      { 
        userPicturePath: picturePath, // Use the updated picturePath
        username: newNameOrDisplayName // Use the updated name or displayName for posts
      }
    );

    res.status(200).json({ message: `${accountType} updated successfully`, data: entity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};