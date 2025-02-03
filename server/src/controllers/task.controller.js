import _ from "lodash";
import { Tasks } from "../models/tasks.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const createTask = asyncHandler(async (req, res) => {
  const { taskDetails, semester } = req.body;
  if (
    [taskDetails, semester].some((fields) => {
      return fields?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  const newTask = await Tasks.create({
    taskDetail: taskDetails,
    semester: _.toNumber(semester),
  });

  const createdTask = await Tasks.findById(newTask._id);

  if (!createTask)
    throw new ApiError(
      404,
      "Something went wrong from our side, Task not created"
    );

  return res
    .status(200)
    .json(new ApiResponse(200, createdTask, "Task created successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const task = await Tasks.findByIdAndDelete(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task Deleted Successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const { newTaskDetails, newSemester } = req.body;
  if (
    [newTaskDetails, newSemester].some((fields) => {
      return fields?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  const Updatetask = await Tasks.findByIdAndUpdate(
    taskId,
    {
      taskDetail: newTaskDetails,
      semester: _.toNumber(newSemester),
    },
    {
      new: true,
    }
  );
  if (!Updatetask) {
    throw new ApiError(303, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, Updatetask, "Task Updatd Successfully"));
});

const getTasks = asyncHandler(async (req, res) => {
  const semester = req.body.semester;
  const tasks = await Tasks.aggregate([
    {
      $match: {
        semester: 3,
      },
    },
    {
      $project: {
        taskDetail: 1,
        semester: 1,
      },
    },
  ]);
  if (tasks.length <= 0) {
    throw new ApiError(400, "No Tasks found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, tasks, `${tasks.length} Tasks fetched successfully`)
    );
});
export { createTask, deleteTask, getTasks, updateTask };
