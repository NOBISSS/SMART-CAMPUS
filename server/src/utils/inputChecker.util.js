import { Student } from "../models/students.model.js";
import { Admin } from "../models/admins.model.js";
import { ApiError } from "./ApiError.js";

export async function checkInput(input, type) {
  if (type == "student") {
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
  else if(type=="admin"){
    let admin;
    if (input.includes("@")) {
      admin = await Admin.findOne({ emailId: input });
      if (!admin) {
        throw new ApiError(404, "No admin found for this email");
      }
    } else {
      admin = await Admin.findOne({ enrollmentId: input });
      if (!admin) {
        throw new ApiError(404, "No admin found for this EnrollmentId");
      }
    }
    return admin;
  }
}
