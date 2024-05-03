import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        // Typically, the Authorization header is in the format "Bearer token"
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }

        // Assuming the decoded token structure includes an _id field (adjust according to your token structure)
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("Error in protectRoute middleware", err.message);
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
