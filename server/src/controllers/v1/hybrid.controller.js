import _ from "lodash";
import { Admin } from "../../models/admins.model.js";
import { Student } from "../../models/students.model.js";
import { TempOTP } from "../../models/tempOTPs.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { checkInput } from "../../utils/inputChecker.util.js";
import sendMail from "../../utils/mailer.util.js";

const generateAccessAndRefreshToken = async (userId, role) => {
  try {
    const user =
      role === "student"
        ? await Student.findById(userId)
        : await Admin.findById(userId);
    if (!user) {
      throw new ApiError(404, "Admin not found");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generating access and refresh tokens"
    );
  }
};

const hybridLogin = asyncHandler(async (req, res) => {
  const { input, password, role } = req.body;

  // Check for missing fields
  if ([input, password, role].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Define shared cookie options
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
  };

  // Common login logic for both students and admins
  try {
    const loginUser = async (user, role) => {
      const isPasswordValid = await user.isPasswordCorrect(password);
      if (!isPasswordValid) {
        throw new ApiError(404, "Invalid Password");
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id,
        role
      );
      if (!accessToken || !refreshToken) {
        throw new ApiError(404, "The tokens are not generated");
      }
      const loggedInUser =
        role === "student"
          ? await Student.findById(user._id).select("-password -refreshToken")
          : await Admin.findById(user._id).select("-password -refreshToken");

      if (!loggedInUser) {
        throw new ApiError(500, "Something went wrong from our side");
      }

      return res
        .status(200)
        .cookie(
          `accessToken${role === "admin" ? "Admin" : ""}`,
          accessToken,
          options
        )
        .cookie(
          `refreshToken${role === "admin" ? "Admin" : ""}`,
          refreshToken,
          options
        )
        .json(
          new ApiResponse(
            200,
            { [role]: loggedInUser, role },
            `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully`
          )
        );
    };

    if (role === "student") {
      let student = await checkInput(input, role);
      if (!student.isRegistered) {
        throw new ApiError(404, "Student has not registered");
      }
      return await loginUser(student, role);
    } else if (role === "admin") {
      let admin = await checkInput(input, role);
      if (!admin) {
        throw new ApiError(404, "Admin not found");
      }
      return await loginUser(admin, role);
    } else {
      return res.status(400).json({ message: "Invalid role selected." });
    }
  } catch (err) {
    throw new ApiError(500, { message: "Something went wrong from our side" });
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
  try {
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
  } catch (err) {
    throw new ApiError(500, { message: "Something went wrong from our side" });
  }
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
  try {
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
    if (role === "student" && !user.isRegistered) {
      throw new ApiError(404, "Student has not registered yet");
    }
    if (isExpired || Date.now() > expiryDate) {
      otpData.isExpired = true;
      await TempOTP.deleteOne({ Gotp: Gotp });
      throw new ApiError(404, "OTP is expired, Generate new OTP");
    }
    if (otpData.Gotp === Gotp) {
      user.$set({ password: password });
      await user.save({ validateBeforeSave: false });
      await TempOTP.deleteOne({ Gotp: Gotp });
      return res
        .status(200)
        .json(new ApiResponse(200, { user }, "Password changed successfully"));
    } else {
      throw new ApiError(404, "Wrong OTP");
    }
  } catch (err) {
    throw new ApiError(500, { message: "Something went wrong from our side" });
  }
});

export { hybridForgetPassword, hybridLogin, verifyHybridOTP };
