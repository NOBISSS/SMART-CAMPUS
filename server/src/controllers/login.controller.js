import { Admin } from "../models/admins.model.js";
import { Student } from "../models/students.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkInput } from "../utils/inputChecker.util.js";
import generateAccessAndRefreshTokenAdmin from "./admin.controller.js";
import generateAccessAndRefreshTokenStudent from "./student.controller.js";

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
      await generateAccessAndRefreshTokenStudent(student._id);
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
  } else {
    return res.status(400).json({ message: "Invalid role selected." });
  }
});

export { hybridLogin };
