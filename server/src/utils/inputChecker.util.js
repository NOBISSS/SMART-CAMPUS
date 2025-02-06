import { Admin } from "../models/admins.model.js";
import { Student } from "../models/students.model.js";
import { ApiError } from "./ApiError.js";

export async function checkInput(input, type) {
  try {
    if (type == "student") {
      let student;
      if (input.includes("@")) {
        student = await Student.findOne({ emailId: input });
        if (!student) {
          throw new ApiError(404, {
            message: "No student found for this email",
          });
        }
      } else {
        student = await Student.findOne({ enrollmentId: input });
        if (!student) {
          throw new ApiError(404, {
            message: "No student found for this EnrollmentId",
          });
        }
      }
      return student;
    } else if (type == "admin") {
      let admin;
      if (input.includes("@")) {
        admin = await Admin.findOne({ emailId: input });
        if (!admin) {
          throw new ApiError(404, { message: "No admin found for this email" });
        }
      } else {
        admin = await Admin.findOne({ adminId: input });
        if (!admin) {
          throw new ApiError(404, {
            message: "No admin found for this adminId",
          });
        }
      }
      return admin;
    }
  } catch (err) {
    throw new ApiError(err.statusCode || 500, 
       err.message || "Something went wrong from our side",
    );
  }
}
