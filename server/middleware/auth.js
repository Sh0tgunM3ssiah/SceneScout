import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    console.log(process.env.JWT_SECRET);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
};