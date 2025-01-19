import mongoose, { Schema } from "mongoose";
/* 
     1.SemesterNo PK
     2.Year
     3.STDCount
*/
const semsterSchema = new Schema({
  semsterNo: {
    type: Number,
    required: true,
    unique: true,
    enum: [1, 2, 3, 4, 5, 6],
    index: true,
  },
  year: {
    type: Date,
    default: Date.now(),
  },
  studentsCount: {
    type: Number,
  },
});

export const Semester = mongoose.model("Semester", semsterSchema);
