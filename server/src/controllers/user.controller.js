import { Student } from "../models/students.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword } from "../utils/hashPassword.util.js";

const registerStudent = asyncHandler(async (req, res) => {
  const { enrollId, password, confirmPassword } = req.body;
  console.log("User give EnrollId :", enrollId);
  console.log("Request body :", req.body);
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
  console.log("Registration status", student.isRegistered);
  console.log("Student EnrollId", student.enrollmentId);
  console.log("Student Password", student.password);
  /* Addition check if needed
      const isRegistered = await student.aggregate([
        {
          $match: {
            isRegistered: true,
          },
        },
        {
          $project: {
            isRegistered: 1,
          },
        },
      ]);*/
  if (student.isRegistered) {
    throw new ApiError(404, "Student already exist");
  }
  if (password == confirmPassword) {
    student.password = await hashPassword(String(password));
    student.isRegistered = true;
  } else {
    throw new ApiError(404, { message: "Both passwords are different" });
  }

  await student.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, student, "Student Registration successfull"));
});
export { registerStudent };
