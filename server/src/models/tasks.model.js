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
        required: true,
      },
      status: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

export const Tasks = mongoose.model("Tasks", tasksSchema);
