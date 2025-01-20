import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { Admin } from "../models/admins.model.js";
import { Student } from "../models/students.model.js";
dotenv.config({ path: "../.env" });
mongoose
  .connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {})
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("Error connecting Database", error);
  });

const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, 10);
};

const insertData = async () => {
  try {
    const students = [
      // Registered Student 1
      {
        enrollmentId: "12345",
        fullName: "John Doe",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("2000-05-10"),
        semester: "611e4c2f5f4b441234abcd12", // ObjectId of the referenced Semester
        emailId: "john.doe@example.com",
        mobileNo: "1234567890",
        gender: "Male",
        password: await hashPassword("studentPassword123"), // Hashed password
        isRegistered: true,
      },
      // Registered Student 2
      {
        enrollmentId: "12346",
        fullName: "Jane Smith",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: new Date("2001-02-12"),
        semester: "611e4c2f5f4b441234abcd13", // ObjectId of the referenced Semester
        emailId: "jane.smith@example.com",
        mobileNo: "0987654321",
        gender: "Female",
        password: await hashPassword("studentPassword456"), // Hashed password
        isRegistered: true,
      },
      // Unregistered Students (Password blank, isRegistered: false)
      {
        enrollmentId: "12347",
        fullName: "Mark Johnson",
        firstName: "Mark",
        lastName: "Johnson",
        dateOfBirth: new Date("2002-08-20"),
        semester: "611e4c2f5f4b441234abcd14", // ObjectId of the referenced Semester
        emailId: "mark.johnson@example.com",
        mobileNo: "1122334455",
        gender: "Male",
        password: "", // No password yet
        isRegistered: false,
      },
      {
        enrollmentId: "12348",
        fullName: "Emily Davis",
        firstName: "Emily",
        lastName: "Davis",
        dateOfBirth: new Date("2001-11-18"),
        semester: "611e4c2f5f4b441234abcd15", // ObjectId of the referenced Semester
        emailId: "emily.davis@example.com",
        mobileNo: "9988776655",
        gender: "Female",
        password: "", // No password yet
        isRegistered: false,
      },
      {
        enrollmentId: "12349",
        fullName: "Michael Brown",
        firstName: "Michael",
        lastName: "Brown",
        dateOfBirth: new Date("2000-01-05"),
        semester: "611e4c2f5f4b441234abcd16", // ObjectId of the referenced Semester
        emailId: "michael.brown@example.com",
        mobileNo: "6655443322",
        gender: "Male",
        password: "", // No password yet
        isRegistered: false,
      },
      {
        enrollmentId: "12350",
        fullName: "Olivia Wilson",
        firstName: "Olivia",
        lastName: "Wilson",
        dateOfBirth: new Date("2002-07-15"),
        semester: "611e4c2f5f4b441234abcd17", // ObjectId of the referenced Semester
        emailId: "olivia.wilson@example.com",
        mobileNo: "2233445566",
        gender: "Female",
        password: "", // No password yet
        isRegistered: false,
      },
      {
        enrollmentId: "12351",
        fullName: "James Lee",
        firstName: "James",
        lastName: "Lee",
        dateOfBirth: new Date("1999-04-12"),
        semester: "611e4c2f5f4b441234abcd18", // ObjectId of the referenced Semester
        emailId: "james.lee@example.com",
        mobileNo: "8877665544",
        gender: "Male",
        password: "", // No password yet
        isRegistered: false,
      },
      {
        enrollmentId: "12352",
        fullName: "Sophia Martinez",
        firstName: "Sophia",
        lastName: "Martinez",
        dateOfBirth: new Date("2003-09-28"),
        semester: "611e4c2f5f4b441234abcd19", // ObjectId of the referenced Semester
        emailId: "sophia.martinez@example.com",
        mobileNo: "7766554433",
        gender: "Female",
        password: "", // No password yet
        isRegistered: false,
      },
      {
        enrollmentId: "12353",
        fullName: "Alexander Taylor",
        firstName: "Alexander",
        lastName: "Taylor",
        dateOfBirth: new Date("2001-05-30"),
        semester: "611e4c2f5f4b441234abcd20", // ObjectId of the referenced Semester
        emailId: "alexander.taylor@example.com",
        mobileNo: "6655778899",
        gender: "Male",
        password: "", // No password yet
        isRegistered: false,
      },
      {
        enrollmentId: "12354",
        fullName: "Mia Anderson",
        firstName: "Mia",
        lastName: "Anderson",
        dateOfBirth: new Date("2000-10-25"),
        semester: "611e4c2f5f4b441234abcd21", // ObjectId of the referenced Semester
        emailId: "mia.anderson@example.com",
        mobileNo: "4433221100",
        gender: "Female",
        password: "", // No password yet
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

    await Student.insertMany(students);
    await Admin.insertMany(admins);

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data", error);
  } finally {
    mongoose.connection.close();
  }
};
insertData();
