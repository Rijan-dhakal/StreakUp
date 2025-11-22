import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const authorize = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return apiError("Authorization header missing", false, 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return apiError("Invalid token", false, 401);
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return apiError("User not found", false, 404);
    }

    req.user = user;
    next();

  } catch (error) {
    return apiError("Authentication failed", false, 401);
  }
};