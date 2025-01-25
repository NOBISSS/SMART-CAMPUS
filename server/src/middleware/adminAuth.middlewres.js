import jwt from "jsonwebtoken";
import { Admin } from "../models/admins.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies.accessTokenAdmin ||
    req.header("Authorization")?.replace("Bearer ", "");
  console.log("VerifyJWT admin token : ", token);
  if (!token) {
    throw new ApiError(401, "Unauthorized token");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    console.log("Decoded admin token : ", decodedToken);
    const user = await Admin.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "unauthorized user");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
export default verifyJWT;
