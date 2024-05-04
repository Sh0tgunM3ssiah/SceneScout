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
app.use(cookieParser());

app.get('/setBackendCookie', (req, res) => {
	const jwtCookie = req.cookies.jwt; // Grab the "jwt" cookie from the request
  
	// Set the "jwt" cookie on the backend domain
	res.cookie('jwt', jwtCookie, {
	  domain: '.scenescout-backend.render.com',
	  httpOnly: true,
	  sameSite: 'none',
	  secure: true
	});
  
	res.send('Backend JWT cookie set successfully');
  });


  app.use(cors({
	origin: 'https://www.scenescout.io', // Allow requests from www.scenescout.io
	credentials: true // Allow credentials (cookies, authorization headers)
  }));
const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/scenes", sceneRoutes);
app.use("/api/notifications", notificationRoutes);

// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
