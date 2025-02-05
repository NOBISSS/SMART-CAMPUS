import _ from "lodash";
import { Admin } from "../models/admins.model.js";
import { TempOTP } from "../models/tempOTPs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkInput } from "../utils/inputChecker.util.js";
import sendMail from "../utils/mailer.util.js";

const generateAccessAndRefreshToken = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new ApiError(404, { message: "Admin not found" });
    }
    const accessToken = await admin.generateAccessToken();
    const refreshToken = await admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, {
      message: "Somthing went wrong while generating access and refresh tokens",
    });
  }
};

const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (
    [otp].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, { message: "All fields are required" });
  }
  const Gotp = _.toNumber(otp);
  try {
    const otpData = await TempOTP.findOne({
      $and: [{ Gotp: Gotp, isForget: true }],
    });
    if (!otpData) {
      throw new ApiError(404, { message: "Enter a valid OTP" });
    }
    const enrollId = otpData.adminId;
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
      throw new ApiError(404, { message: "OTP is expired, Generate new OTP" });
    }
    if (otpData.Gotp === Gotp) {
      admin.$set({ password: password });
      await admin.save({ validateBeforeSave: false });
      await TempOTP.deleteOne({ Gotp: Gotp });
      return res
        .status(200)
        .json(new ApiResponse(200, { admin }, "Password changed successfully"));
    } else {
      throw new ApiError(404, { message: "Wrong OTP" });
    }
  } catch (err) {
    throw new ApiError(500, { message: "Something went wrong from our side" });
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { input, password } = req.body;
  if (
    [input, password].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, { message: "All fields are required" });
  }
  try {
    let admin = await checkInput(input, "admin");
    if (!admin) {
      throw new ApiError(404, { message: "Admin not found" });
    }
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(404, { message: "Invalid Password" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      admin._id
    );
    const loggedInAdmin = await Admin.findById(admin._id).select(
      "-password -refreshToken"
    );
    if (!loggedInAdmin) {
      throw new ApiError(500, {
        message: "Something went wrong from our side",
      });
    }
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    return res
      .status(200)
      .cookie("accessTokenAdmin", accessToken, options)
      .cookie("refreshTokenAdmin", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { admin: loggedInAdmin },
          "Admin Logged in successfully"
        )
      );
  } catch (err) {
    throw new ApiError(500, { message: "Something went wrong from our side" });
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { input, newPassword, confirmNewPassword } = req.body;
  if (
    [input, newPassword, confirmNewPassword].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, { message: "All fields are required" });
  }
  try {
    const admin = await checkInput(input, "admin");
    if (newPassword !== confirmNewPassword) {
      throw new ApiError(404, { message: "Given password didn't match" });
    }
    const Gotp = await sendMail(admin.emailId);
    const adminId = admin.adminId;
    const expiryAt = new Date();
    expiryAt.setMinutes(expiryAt.getMinutes() + 10);
    const password = newPassword;
    const tempOTP = await TempOTP.create({
      Gotp,
      adminId,
      expiryAt,
      password,
      isForget: true,
    });
    await tempOTP.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, { admin, Gotp }, "OTP Generated sucessfully"));
  } catch (err) {
    throw new ApiError(500, { message: "Something went wrong from our side" });
  }
});

const getAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req?.user, "Admin Data Fetched Sucessfully"));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  try {
    const admin = await Admin.findById(req.user?._id);
    const isPasswordValid = await admin.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
      throw new ApiError(404, { message: "Old password is invalid" });
    }
    if (newPassword !== confirmNewPassword) {
      throw new ApiError(404, { message: "Given password didn't match" });
    }
    admin.$set({ password: newPassword });
    await admin.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (err) {
    throw new ApiError(500, { message: "Something went wrong from our side" });
  }
});

export { forgetPassword, getAdmin, loginAdmin, updatePassword, verifyOTP };
