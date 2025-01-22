import mongoose, { Schema } from "mongoose";
/* 
     1.NoticeHeading
     2.NoticeDetails
     3.NoticeDateTime
     4.UpdatedNoticeDateTime
     5.Semester refers to Semester_DB
*/
const noticeSchema = new Schema(
  {
    NoticeHeading: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      ref: "Semester",
    },
    NoticeDetails: {
      type: String,
      required: true,
    },
    NoticeImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Notice = mongoose.model("Notice", noticeSchema);
