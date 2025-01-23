import _ from "lodash";
import { Admin } from "../models/admins.model.js";
import { TempOTP } from "../models/tempOTPs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkInput } from "../utils/inputChecker.util.js";

const generateAccessAndRefreshToken = async (enrollmentId) => {
  try {
    const admin = await Admin.findById(enrollmentId);
    if (!admin) {
      throw new ApiError(404, "Student not found");
    }
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generating access and refresh tokens"
    );
  }
};

const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (
    [otp].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const Gotp = _.toNumber(otp);
  const otpData = await TempOTP.findOne({
    $and: [{ Gotp: Gotp, isForget: false }],
  });
  if (!otpData) {
    throw new ApiError(404, "Enter a valid OTP");
  }
  const enrollId = otpData.enrollmentId;
  const expiryDate = otpData.expiryAt;
  const isExpired = otpData.isExpired;
  const password = otpData.password;
  const admin = await Admin.findOne({ enrollmentId: enrollId });
  if (!admin) {
    throw new ApiError(400, { message: "admin not found" });
  }
  if (isExpired || Date.now() > expiryDate) {
    otpData.isExpired = true;
    await TempOTP.deleteOne({ Gotp: Gotp });
    throw new ApiError(404, "OTP is expired, Generate new OTP");
  }
  if (otpData.Gotp === Gotp) {
    admin.isRegistered = true;
    admin.$set({ password: password });
    await admin.save({ validateBeforeSave: false });
    await TempOTP.deleteOne({ Gotp: Gotp });
    return res
      .status(200)
      .json(new ApiResponse(200, { admin }, "User Registered Successfully"));
  } else {
    throw new ApiError(404, "Wrong OTP");
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { input, password } = req.body;
  if (
    [input, password].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  let admin = await checkInput(input, "admin");
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }
  const isPasswordValid = await admin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid Password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    admin._id
  );
  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );
  if (!loggedInAdmin) {
    throw new ApiError(500, "Something went wrong from our side");
  }
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { admin: loggedInAdmin },
        "Admin Logged in successfully"
      )
    );
});

export { loginAdmin, verifyOTP };
