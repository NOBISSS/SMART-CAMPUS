import mongoose, { Schema } from "mongoose";
/* 
     1.SubjectName
     2.Semester refers to Semester_DB
     3.PDF/IMG of SLB
*/
const syllabusSchema = new Schema(
  {
    subjectName: {
      type: String,
      required: true,
      unique: true,
    },
    semester: {
      type: Number,
      ref: "Semester",
    },
    syllabusFile: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Syllabus = mongoose.model("Syllabus", syllabusSchema);
