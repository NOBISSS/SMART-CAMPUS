import _ from "lodash";
import { Student } from "../models/students.model.js";
import { TempOTP } from "../models/tempOTPs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkInput } from "../utils/inputChecker.util.js";
import sendMail from "../utils/mailer.util.js";

const generateAccessAndRefreshToken = async (enrollmentId) => {
  try {
    const student = await Student.findById(enrollmentId);
    if (!student) {
      throw new ApiError(404, "Student not found");
    }
    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generating access and refresh tokens"
    );
  }
};

const registerStudent = asyncHandler(async (req, res) => {
  const { enrollId, password, confirmPassword } = req.body;
  if (
    [enrollId, password, confirmPassword].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(404, { message: "All fields are required" });
  }
  const enrollmentId = enrollId.toString();
  const student = await Student.findOne({ enrollmentId }).select(
    "-password -refreshToken"
  );
  if (!student) {
    throw new ApiError(404, "Student not found");
  }
  if (student.isRegistered) {
    throw new ApiError(404, "Student already exist");
  }
  if (password !== confirmPassword) {
    throw new ApiError(404, { message: "Both passwords are different" });
  }
  const Gotp = await sendMail(student.emailId);
  const expiryAt = new Date();
  expiryAt.setMinutes(expiryAt.getMinutes() + 10);
  const tempOTP = await TempOTP.create({
    Gotp,
    enrollmentId,
    expiryAt,
    password,
  });
  await tempOTP.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { student: student, Gotp },
        "Otp Generated Successfully"
      )
    );
});
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
  const otpData = await TempOTP.findOne({ Gotp: Gotp });
  if (!otpData) {
    throw new ApiError(404, "Enter a valid OTP");
  }
  const enrollId = otpData.enrollmentId;
  const expiryDate = otpData.expiryAt;
  const isExpired = otpData.isExpired;

  const student = await Student.findOne({ enrollmentId: enrollId });
  if (!student) {
    throw new ApiError(400, { message: "Student not found" });
  }
  if (isExpired || Date.now() > expiryDate) {
    otpData.isExpired = true;
    await TempOTP.deleteOne({ Gotp: Gotp });
    student.password = null;
    await student.save({ validateBeforeSave: false });
    throw new ApiError(404, "OTP is expired, Generate new OTP");
  }
  if (otpData.Gotp === Gotp) {
    student.isRegistered = true;
    await student.save({ validateBeforeSave: false });
    await TempOTP.deleteOne({ Gotp: Gotp });
    return res
      .status(200)
      .json(new ApiResponse(200, { student }, "User Registered Successfully"));
  } else {
    student.password = null;
    await student.save({ validateBeforeSave: false });
    throw new ApiError(404, "Wrong OTP");
  }
});

const loginStudent = asyncHandler(async (req, res) => {
  const { input, password } = req.body;
  if (
    [input, password].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  let student = await checkInput(input);
  if (!student.isRegistered) {
    throw new ApiError(404, "Student has not registered");
  }
  const isPasswordValid = await student.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid Password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    student._id
  );
  const loggedInStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );
  if (!loggedInStudent) {
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
        { student: loggedInStudent },
        "Student Logged in successfully"
      )
    );
});

const updatePassword = asyncHandler(
  asyncHandler(async (req, res) => {
    const { newPassword, confirmNewPassword } = req.body;
  })
);
export { loginStudent, registerStudent, updatePassword, verifyOTP };
