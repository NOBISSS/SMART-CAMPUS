import { Student } from "../models/students.model.js";
import { ApiError } from "./ApiError.js";

export async function checkInput(input) {
  let student;
  if (input.includes("@")) {
    student = await Student.findOne({ emailId: input });
    if (!student) {
      throw new ApiError(404, "No student found for this email");
    }
  } else {
    student = await Student.findOne({ enrollmentId: input });
    if (!student) {
      throw new ApiError(404, "No student found for this EnrollmentId");
    }
  }
  return student;
}
