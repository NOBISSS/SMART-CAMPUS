import jwt from "jsonwebtoken";
import { Student } from "../models/students.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized token");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    const user = await Student.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Unauthorized user");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
