import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";


export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access token missing or invalid");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user; 
    next();
  } catch (error) {
    return res.status(403).send("Invalid token");
  }
};
