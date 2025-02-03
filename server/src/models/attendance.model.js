import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema({
  semester: {
    type: Number,
    ref: "Semester",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  attendanceRecords: [
    {
      enrollmentId: {
        type: String,
        ref: "Student",
        required: true,
      },
      attendance: {
        type: String,
        enum: ["present", "absent"],
        required: true,
      },
    },
  ],
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);
