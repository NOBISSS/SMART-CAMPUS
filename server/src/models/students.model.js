import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
/* 
     1.EnrollmentId	
     2.FullName
     3.FirstName
     4.LastName
     5.DateOfBirth
     6.Semester - refers to Semester DB
     7.EmailId
     8.MobileNo
     9.Gender
     10.Password - After Registration
     11.Registered - TRUE/FALSE
*/
const studentSchema = new Schema(
  {
    enrollmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    mobileNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
      trim: true,
    },
    password: {
      type: String,
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
    semester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
    },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);

  return next();
});

studentSchema.methods.isPasswordCorrect = async function (givenPassword) {
  console.log("Actual password", this.password);
  console.log("user given password", givenPassword);
  return await bcrypt.compare(givenPassword, this.password);
};
const AccessToken = "fQwQko1bL9YAGPatfM/pDu5inYBLwaGd6cDqqHsQiYM=";
const RefreshToken = "pXyu/50QKLz3NxFs8+L7ZOXBKz/9DUgljsnWTZ+CW0U=";
studentSchema.methods.generateAccessToken = async function () {
  return jsonwebtoken.sign(
    {
      _id: this._id,
      enrollmentId: this.enrollmentId,
      email: this.emailId,
      fullName: this.fullName,
    },
    AccessToken,
    { expiresIn: "1d" }
  );
};
studentSchema.methods.generateRefreshToken = async function () {
  return jsonwebtoken.sign(
    {
      _id: this._id,
    },
    RefreshToken,
    { expiresIn: "10d" }
  );
};

export const Student = mongoose.model("Student", studentSchema);
