import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { Student } from "../models/students.model.js";
import { hashPassword } from "../utils/hashPassword.util.js";
dotenv.config({ path: "../.env" });
mongoose
  .connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {})
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("Error connecting Database", error);
  });

const insertData = async () => {
  try {
    const students = [
      // Registered Student 1
      {
        enrollmentId: "12321",
        fullName: "Mohammed Arafat",
        firstName: "Mohammed",
        lastName: "Arafat",
        dateOfBirth: new Date("2006-01-30"),
        semester: "611e4c2f5f4b441234abcd22", // ObjectId of the referenced Semester
        emailId: "norep@mail.com",
        mobileNo: "9374470038",
        gender: "Male",
        isRegistered: false,
      },
    ];

    const admins = [
      {
        adminId: "admin1",
        fullName: "Admin",
        firstName: "Admin",
        lastName: "One",
        emailId: "mansurianas983@gmail.com",
        password: await hashPassword("adminPassword123"), // Hash the admin password
      },
    ];
    const otp = [
      {
        Gotp: 12345,
        enrollmentId: "12320",
        expiryAt: "03-20-2023",
        isExpired: true,
      },
      {
        Gotp: 12346,
        enrollmentId: "12350",
        expiryAt: "01-30-2024",
      },
      {
        Gotp: 12347,
        enrollmentId: "12349",
        expiryAt: "01-25-2023",
      },
      {
        Gotp: 12348,
        enrollmentId: "12347",
        expiryAt: "01-20-2022",
      },
    ];
    await Student.insertMany(students);
    // await TempOTP.insertMany(otp);
    // await Admin.insertMany(admins);

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data", error);
  } finally {
    mongoose.connection.close();
  }
};
insertData();
