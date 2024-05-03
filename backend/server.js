import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from 'cors';

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import sceneRoutes from "./routes/scene.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const corsOptions = {
    origin: 'https://www.scenescout.io', // This should be the domain of your frontend application
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/scenes", sceneRoutes);
app.use("/api/notifications", notificationRoutes);

// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, '/frontend/dist')));

// Adjust the route handler to serve the index.html from the correct location
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/dist/index.html'));
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
