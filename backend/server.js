import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from 'cors';
import { Server as SocketIOServer } from "socket.io";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import sceneRoutes from "./routes/scene.route.js";
import messageRoutes from "./routes/messages.route.js";
import notificationRoutes from "./routes/notification.route.js";
import searchRoutes from "./routes/search.route.js";
import messageBoardRoutes from "./routes/messageBoard.route.js";
import classifiedsRoutes from './routes/classifieds.route.js';
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config({
    path: `./.env.${process.env.NODE_ENV}`
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/scenes", sceneRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/messageBoard", messageBoardRoutes);
app.use("/api/classifieds", classifiedsRoutes);

app.use(express.static(path.resolve('frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve('frontend/dist/index.html'));
});

connectMongoDB();
const server = app.listen(PORT, () =>
    console.log(`Server started on ${PORT}`)
);

const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.ORIGIN_URL,
        credentials: true,
    },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });
});