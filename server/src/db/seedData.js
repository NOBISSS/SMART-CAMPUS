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
      {
        enrollmentId: "12320",
        fullName: "John Doe",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("2000-05-10"),
        semester: 5, // Semester number
        emailId: "john.doe@example.com",
        mobileNo: "1234567890",
        gender: "Male",
        password: "hashedPassword123",
        isRegistered: true,
      },
      {
        enrollmentId: "12321",
        fullName: "Jane Smith",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: new Date("2001-02-12"),
        semester: 3, // Semester number
        emailId: "jane.smith@example.com",
        mobileNo: "0987654321",
        gender: "Female",
        password: "hashedPassword456",
        isRegistered: true,
      },
      {
        enrollmentId: "12322",
        fullName: "Mark Johnson",
        firstName: "Mark",
        lastName: "Johnson",
        dateOfBirth: new Date("2002-08-20"),
        semester: 2, // Semester number
        emailId: "mark.johnson@example.com",
        mobileNo: "1122334455",
        gender: "Male",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12323",
        fullName: "Emily Davis",
        firstName: "Emily",
        lastName: "Davis",
        dateOfBirth: new Date("2001-11-18"),
        semester: 4, // Semester number
        emailId: "emily.davis@example.com",
        mobileNo: "9988776655",
        gender: "Female",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12324",
        fullName: "Michael Brown",
        firstName: "Michael",
        lastName: "Brown",
        dateOfBirth: new Date("2000-01-05"),
        semester: 5, // Semester number
        emailId: "michael.brown@example.com",
        mobileNo: "6655443322",
        gender: "Male",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12325",
        fullName: "Olivia Wilson",
        firstName: "Olivia",
        lastName: "Wilson",
        dateOfBirth: new Date("2002-07-15"),
        semester: 1, // Semester number
        emailId: "olivia.wilson@example.com",
        mobileNo: "2233445566",
        gender: "Female",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12326",
        fullName: "James Lee",
        firstName: "James",
        lastName: "Lee",
        dateOfBirth: new Date("1999-04-12"),
        semester: 6, // Semester number
        emailId: "james.lee@example.com",
        mobileNo: "8877665544",
        gender: "Male",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12327",
        fullName: "Sophia Martinez",
        firstName: "Sophia",
        lastName: "Martinez",
        dateOfBirth: new Date("2003-09-28"),
        semester: 2, // Semester number
        emailId: "sophia.martinez@example.com",
        mobileNo: "7766554433",
        gender: "Female",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12328",
        fullName: "Alexander Taylor",
        firstName: "Alexander",
        lastName: "Taylor",
        dateOfBirth: new Date("2001-05-30"),
        semester: 3, // Semester number
        emailId: "alexander.taylor@example.com",
        mobileNo: "6655778899",
        gender: "Male",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12329",
        fullName: "Mia Anderson",
        firstName: "Mia",
        lastName: "Anderson",
        dateOfBirth: new Date("2000-10-25"),
        semester: 5, // Semester number
        emailId: "mia.anderson@example.com",
        mobileNo: "4433221100",
        gender: "Female",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12330",
        fullName: "Liam White",
        firstName: "Liam",
        lastName: "White",
        dateOfBirth: new Date("2002-03-14"),
        semester: 2, // Semester number
        emailId: "liam.white@example.com",
        mobileNo: "5566778899",
        gender: "Male",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12331",
        fullName: "Noah Walker",
        firstName: "Noah",
        lastName: "Walker",
        dateOfBirth: new Date("2000-06-22"),
        semester: 4, // Semester number
        emailId: "noah.walker@example.com",
        mobileNo: "9988771122",
        gender: "Male",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12332",
        fullName: "Ava Thomas",
        firstName: "Ava",
        lastName: "Thomas",
        dateOfBirth: new Date("2001-11-11"),
        semester: 3, // Semester number
        emailId: "ava.thomas@example.com",
        mobileNo: "5544332211",
        gender: "Female",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12333",
        fullName: "Lucas Harris",
        firstName: "Lucas",
        lastName: "Harris",
        dateOfBirth: new Date("2002-01-07"),
        semester: 1, // Semester number
        emailId: "lucas.harris@example.com",
        mobileNo: "6677889900",
        gender: "Male",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12334",
        fullName: "Ella Clark",
        firstName: "Ella",
        lastName: "Clark",
        dateOfBirth: new Date("1999-12-09"),
        semester: 6, // Semester number
        emailId: "ella.clark@example.com",
        mobileNo: "7788990011",
        gender: "Female",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12335",
        fullName: "Mohammed Arafat",
        firstName: "Mohammed",
        lastName: "Arafat",
        dateOfBirth: new Date("2006-1-30"),
        semester: 3, // Semester number
        emailId: "mansuriarafat302@gmail.com",
        mobileNo: "7788990012",
        gender: "Male",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12336",
        fullName: "Mohammed Anas",
        firstName: "Mohammed",
        lastName: "Anas",
        dateOfBirth: new Date("2006-1-30"),
        semester: 4, // Semester number
        emailId: "masnurianas236@gmail.com",
        mobileNo: "7788990013",
        gender: "Male",
        password: "",
        isRegistered: false,
      },
      {
        enrollmentId: "12337",
        fullName: "Hasan Raza",
        firstName: "Hasan",
        lastName: "Raza",
        dateOfBirth: new Date("2007-12-10"),
        semester: 2, // Semester number
        emailId: "hasanrza@example.com",
        mobileNo: "7788990014",
        gender: "Male",
        password: "",
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
