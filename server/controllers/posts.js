import Post from "../models/Post.js";
import User from "../models/User.js";
import { BlobServiceClient } from "@azure/storage-blob";

const account = process.env.ACCOUNT_NAME;
const sas = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);
const containerClient = blobServiceClient.getContainerClient(containerName);

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      username,
      sceneId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    let query = {}; // Initialize an empty query object

    // Check if sceneId is provided in the query params
    if (req.query.sceneId) {
      // Update the query to filter by sceneId
      query.sceneId = req.query.sceneId;
    }

    // Use the query object in your find method
    const posts = await Post.find(query);
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.picturePath) {
      // Create a URL object from the picturePath
      const url = new URL(post.picturePath);
      // Correctly extract the blob name by removing the leading '/' and any incorrect prefix
      const blobName = url.pathname.replace(/^\/blobby\//, "");  // Removes the initial '/blobby/' if it exists

      try {
        await containerClient.deleteBlob(blobName);
        console.log("Blob deleted successfully:", blobName);
      } catch (error) {
        if (error.details && error.details.errorCode === 'BlobNotFound') {
          console.warn("Blob already deleted or not found:", blobName);
        } else {
          console.error(`Failed to delete blob: ${blobName}`, error);
          return res.status(500).json({ message: `Failed to delete blob: ${blobName}` });
        }
      }
    }

    // Proceed to delete the post from the database
    await Post.findByIdAndRemove(id);
    res.status(200).json({ message: "Post and associated image deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: error.message });
  }
};
