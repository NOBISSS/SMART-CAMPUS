import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
/* 
     1.SubjectName
     2.subectMarks
     3.EnrollId refers to Students_DB(EnrollId)
     4.semester Refres to Semester(SemesterNo)
*/
const marksSchema = new Schema(
  {
    subjectName: {
      type: String,
      required: true,
    },
    subjectMarks: {
      type: Number,
      required: true,
    },
    enrollId: {
      type: String,
      ref: "Student",
    },
    semester: {
      type: Number,
      ref: "Semester",
    },
  },
  { timestamps: true }
);
marksSchema.plugin(mongooseAggregatePaginate);
export const Marks = mongoose.model("Marks", marksSchema);
