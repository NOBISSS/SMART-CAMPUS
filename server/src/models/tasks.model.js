import mongoose, { Schema } from "mongoose";

const tasksSchema = new Schema({
  taskDetail: {
    type: String,
    required: true,
    unique: true,
  },
  semester: {
    type: Number,
    ref: "Semester",
    required: true,
  },
  taskStatus: [
    {
      student: {
        type: String,
        ref: "Student",
      },
      status: {
        type: Boolean,
      },
    },
  ],
});

export const Tasks = mongoose.model("Tasks", tasksSchema);
