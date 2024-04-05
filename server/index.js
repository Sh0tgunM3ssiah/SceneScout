import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import sceneRoutes from "./routes/scenes.js";
import artistRoutes from "./routes/artists.js";
import eventsRoutes from "./routes/events.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import http from 'http';
import multer from 'multer';
import { MulterAzureStorage } from 'multer-azure-blob-storage';
import { BlobServiceClient } from "@azure/storage-blob";
import User from './models/User.js'; // Adjust the import path according to your project structure
import Artist from './models/Artist.js';
import Post from './models/Post.js';
import Event from './models/Event.js';
import {editUser} from './controllers/users.js';

/* AZURE BLOB STORAGE SETUP */
const account = process.env.ACCOUNT_NAME;
const sas = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);
const containerClient = blobServiceClient.getContainerClient(containerName);
const azureBlobName = '';

// Custom Multer Storage Engine for Azure Blob Storage
const resolveBlobName = (req, file) => {
  return new Promise((resolve, reject) => {
      const timestamp = Date.now();
      const blobName = `uploads/${timestamp}-${file.originalname}`;
      const azureBlobName = blobName;
      resolve(blobName);
  });
};

const resolveMetadata = (req, file) => {
  return new Promise((resolve, reject) => {
      const metadata = {
          originalName: file.originalname,
          uploadedBy: req.body.username || 'anonymous', // Example: Extract username from request
      };
      resolve(metadata);
  });
};

const resolveContentSettings = (req, file) => {
  return new Promise((resolve, reject) => {
      const contentSettings = {
          contentType: file.mimetype,
      };
      resolve(contentSettings);
  });
};

const azureStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_CONNECTION_STRING,
  accessKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
  accountName: process.env.ACCOUNT_NAME,
  containerName: process.env.CONTAINER_NAME,
  blobName: resolveBlobName,
  metadata: resolveMetadata,
  contentSettings: resolveContentSettings,
  containerAccessLevel: 'Blob',
  urlExpirationTime: 60
});

const upload = multer({
  storage: azureStorage
});

/* EXPRESS SETUP */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), async (req, res) => {
  const {
    userId,
    username,
    displayName,
    accountType,
    firstName,
    lastName,
    artistName,
    email,
    friends,
    followers,
    location,
    genre,
    members,
    scene,
    sceneName,
    bio,
  } = req.body;

  const picturePath = `https://${account}.blob.core.windows.net/${containerName}/${req.file.blobName}`;

  try {
    if (accountType === 'User') {
      const newUser = new User({
        userId,
        username,
        displayName,
        firstName,
        lastName,
        accountType,
        email,
        picturePath, // Picture uploaded to Azure Blob
        friends,
        followers,
        location,
        scene,
        sceneName,
        bio,
        viewedProfile: 0,
        impressions: 0,
      });
      await newUser.save();
      res.status(201).json(newUser);
    } else if (accountType === 'Artist') {
      // Ensure Artist model exists and is similar to User but includes 'genre' and 'members'
      const newArtist = new Artist({
        userId,
        username,
        name: artistName,
        email,
        accountType,
        picturePath, // Picture uploaded to Azure Blob
        genre,
        members,
        location,
        scene,
        sceneName,
        friends,
        followers,
        bio,
        viewedProfile: 0,
        impressions: 0,
      });
      await newArtist.save();
      res.status(201).json(newArtist);
    } else {
      res.status(400).json({ error: 'Invalid account type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/posts", upload.single("picture"), async (req, res) => {
  const {
    username,
    userId,
    postType,
    sceneId,
    sceneName,
    location,
    description,
    userPicturePath
  } = req.body;

  // The URL of the uploaded file is directly accessible via the `req.file` object
  // provided by the `MulterAzureStorage` engine
  let picturePath = req.file ? req.file.url.split('?')[0] : '';


  try {
    // Assuming `userId` is used to fetch user details, including `firstName` and `lastName`
    // If these details are not in `req.body`, ensure they are fetched from the database
    const newPost = new Post({
      username,
      userId,
      postType,
      sceneId,
      sceneName,
      location,
      description,
      picturePath,
      userPicturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/events/create", upload.single("picture"), async (req, res) => {
  const {
    username,
    userId,
    sceneId,
    sceneName,
    name,
    venueName,
    location,
    description,
    bands,
    genres,
    ticketLink,
    facebookLink
  } = req.body;

  // The URL of the uploaded file is directly accessible via the `req.file` object
  // provided by the `MulterAzureStorage` engine
  let picturePath = req.file ? req.file.url.split('?')[0] : '';


  try {
    // Assuming `userId` is used to fetch user details, including `firstName` and `lastName`
    // If these details are not in `req.body`, ensure they are fetched from the database
    const newEvent = new Event({
      username,
      userId,
      postType: "Event",
      sceneId,
      sceneName,
      eventName: name,
      venueName,
      location,
      description,
      picturePath,
      bands,
      genres,
      ticketLink,
      facebookLink,
      likes: {},
      comments: [],
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/users/edit/:id', upload.single('image'), editUser);


/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/scenes", sceneRoutes);
app.use("/artists", artistRoutes);
app.use("/events", eventsRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));