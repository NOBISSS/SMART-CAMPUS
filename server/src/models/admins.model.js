import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
/* 
     1.AdminId
     2.FullName
     3.FirstName
     4.LastName
     5.EmailId
     6.Password
*/
const adminSchema = new Schema(
  {
    adminId: {
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
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);

  return next();
});

adminSchema.methods.isPasswordCorrect = async function (givenPassword) {
  return await bcrypt.compareSync(givenPassword, this.password);
};

adminSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      adminId: this.enrollmentId,
      email: this.emailId,
      fullName: this.fullName,
      role: "admin",
    },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: "1d" }
  );
};
adminSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: "10d" }
  );
};

export const Admin = mongoose.model("Admin", adminSchema);
