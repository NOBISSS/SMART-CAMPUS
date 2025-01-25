import { Admin } from "../models/admins.model.js";
import { Student } from "../models/students.model.js";
import { TempOTP } from "../models/tempOTPs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkInput } from "../utils/inputChecker.util.js";
import sendMail from "../utils/mailer.util.js";

const hybridLogin = asyncHandler(async (req, res) => {
  const { input, password, role } = req.body;
  if (
    [input, password, role].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (role === "student") {
    let student = await checkInput(input, role);
    if (!student.isRegistered) {
      throw new ApiError(404, "Student has not registered");
    }
    const isPasswordValid = await student.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(404, "Invalid Password");
    }
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokenStudent(student.enrollmentId);
    const loggedInStudent = await Student.findById(student._id).select(
      "-password -refreshToken"
    );
    // console.log(accessToken);
    if (!loggedInStudent) {
      throw new ApiError(500, "Something went wrong from our side");
    }
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { student: loggedInStudent, role: "student" },
          "Student Logged in successfully"
        )
      );
  } else if (role === "admin") {
    let admin = await checkInput(input, role);
    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(404, "Invalid Password");
    }
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokenAdmin(admin._id);
    const loggedInAdmin = await Admin.findById(admin._id).select(
      "-password -refreshToken"
    );
    console.log(
      "Admin Login Conroller Logged Token:1",
      accessToken,
      "Token2 :",
      refreshToken
    );
    if (!loggedInAdmin) {
      throw new ApiError(500, "Something went wrong from our side");
    }
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    };
    return res
      .status(200)
      .cookie("accessTokenAdmin", accessToken, options)
      .cookie("refreshTokenAdmin", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { admin: loggedInAdmin, role: "admin" },
          "Admin Logged in successfully"
        )
      );
  } else {
    return res.status(400).json({ message: "Invalid role selected." });
  }
});

const hybridForgetPassword = asyncHandler(async (req, res) => {
  const { input, newPassword, confirmNewPassword, role } = req.body;
  if (
    [input, newPassword, confirmNewPassword, role].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await checkInput(input, role);
  if (newPassword !== confirmNewPassword) {
    throw new ApiError(404, "Given password didn't match");
  }
  const Gotp = await sendMail(user.emailId);
  const userId = role === "student" ? user.enrollmentId : user.adminId;
  const expiryAt = new Date();
  expiryAt.setMinutes(expiryAt.getMinutes() + 10);
  const password = newPassword;
  const tempOTP = await TempOTP.create({
    Gotp,
    userId,
    expiryAt,
    password,
    role,
    isForget: true,
  });
  await tempOTP.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, { user, Gotp }, "OTP Generated sucessfully"));
});

const verifyHybridOTP = asyncHandler(async (req, res) => {
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
    $and: [{ Gotp: Gotp, isForget: true }],
  });
  if (!otpData) {
    throw new ApiError(404, "Enter a valid OTP");
  }
  const userId = otpData.userId;
  const expiryDate = otpData.expiryAt;
  const isExpired = otpData.isExpired;
  const password = otpData.password;
  const role = otpData.role;
  const user =
    role === "admin"
      ? await Admin.findOne({ adminId: userId })
      : await Student.findOne({ enrollmentId: userId });
  if (!user) {
    throw new ApiError(400, { message: "user not found" });
  }
  if (isExpired || Date.now() > expiryDate) {
    otpData.isExpired = true;
    await TempOTP.deleteOne({ Gotp: Gotp });
    throw new ApiError(404, "OTP is expired, Generate new OTP");
  }
  if (otpData.Gotp === Gotp) {
    if (role ==="student") {
      user.isRegistered = true;
    }
    user.$set({ password: password });
    await user.save({ validateBeforeSave: false });
    await TempOTP.deleteOne({ Gotp: Gotp });
    return res
      .status(200)
      .json(new ApiResponse(200, { user }, "Password changed successfully"));
  } else {
    throw new ApiError(404, "Wrong OTP");
  }
});

export { hybridForgetPassword, hybridLogin, verifyHybridOTP };
