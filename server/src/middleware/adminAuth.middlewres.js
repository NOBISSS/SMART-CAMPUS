import jwt from "jsonwebtoken";
import { Admin } from "../models/admins.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies.accessTokenAdmin ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, {message:"Unauthorized token"});
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    const user = await Admin.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, { message: "unauthorized user" });
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      { message: error?.message } || { message: "Invalid access token" }
    );
  }
});
export default verifyJWT;
