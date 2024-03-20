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
import bandRoutes from "./routes/bands.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import http from 'http';
import multer from 'multer';
import { MulterAzureStorage } from 'multer-azure-blob-storage';
import { BlobServiceClient } from "@azure/storage-blob";
import User from './models/User.js'; // Adjust the import path according to your project structure
import Band from './models/Band.js';
import Post from './models/Post.js';

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
    accountType,
    firstName,
    lastName,
    bandName,
    email,
    friends,
    location,
    genre,
    members,
    scene,
  } = req.body;

  const picturePath = `https://${account}.blob.core.windows.net/${containerName}/${req.file.blobName}`;

  try {
    if (accountType === 'User') {
      const newUser = new User({
        userId,
        username,
        firstName,
        lastName,
        email,
        picturePath, // Picture uploaded to Azure Blob
        friends,
        location,
        scene,
        viewedProfile: 0,
        impressions: 0,
      });
      await newUser.save();
      res.status(201).json(newUser);
    } else if (accountType === 'Band') {
      // Ensure Band model exists and is similar to User but includes 'genre' and 'members'
      const newBand = new Band({
        userId,
        username,
        name: bandName,
        email,
        picturePath, // Picture uploaded to Azure Blob
        genre,
        members,
        location,
        scene,
        friends,
        viewedProfile: 0,
        impressions: 0,
      });
      await newBand.save();
      res.status(201).json(newBand);
    } else {
      res.status(400).json({ error: 'Invalid account type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/posts", upload.single("picture"), async (req, res) => {
  const {
    userId,
    sceneId,
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
      userId,
      sceneId,
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


/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/scenes", sceneRoutes);
app.use("/bands", bandRoutes);

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