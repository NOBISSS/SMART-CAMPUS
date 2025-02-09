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
  try {
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
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Tasks.findByIdAndDelete(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task Deleted Successfully"));
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
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
  try {
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
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
});

const getTasksBySemester = asyncHandler(async (req, res) => {
  const semester = req.params.semester;
  try {
    const tasks = await Tasks.aggregate([
      {
        $match: {
          semester: _.toNumber(semester),
        },
      },
      {
        $project: {
          taskDetail: 1,
          semester: 1,
        },
      },
    ]);
    console.log(tasks);
    if (tasks.length <= 0) {
      throw new ApiError(400, "No Tasks found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          tasks,
          `${tasks.length} Tasks fetched successfully`
        )
      );
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
});
const getTasksBySemesterStudents = asyncHandler(async (req, res) => {
  const semester = req.user.semester;
  try {
    const tasks = await Tasks.aggregate([
      {
        $match: {
          semester: _.toNumber(semester),
        },
      },
      {
        $project: {
          taskDetail: 1,
          semester: 1,
        },
      },
    ]);
    console.log(tasks);
    if (tasks.length <= 0) {
      throw new ApiError(400, "No Tasks found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          tasks,
          `${tasks.length} Tasks fetched successfully`
        )
      );
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
});
const getTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await Tasks.aggregate([
      {
        $project: {
          taskDetail: 1,
          semester: 1,
        },
      },
      {
        $sort: {
          semester: 1,
        },
      },
    ]);
    console.log(tasks);
    if (tasks.length <= 0) {
      throw new ApiError(400, "No Tasks found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          tasks,
          `${tasks.length} Tasks fetched successfully`
        )
      );
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
});

const setStatus = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await Tasks.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Invalid task choosen");
    }

    const enrollmentId = req.user.enrollmentId;
    if (task.taskStatus.length <= 0) {
      task.taskStatus.push({
        student: enrollmentId,
        status: true,
      });
    } else if (task.taskStatus.length > 0) {
      const currentStudent = task.taskStatus.find(
        (value) => value.student === enrollmentId
      );
      if (!currentStudent) {
        task.taskStatus.push({
          student: enrollmentId,
          status: true,
        });
      } else {
        const currentStatus = currentStudent.status;
        const status = currentStatus === false ? true : false;
        // console.log(currentStudent);
        const taskStatusArr = await Tasks.aggregate([
          {
            $match: {
              $and: [
                {
                  "taskStatus.student": enrollmentId,
                  _id: task._id,
                },
              ],
            },
          },
          {
            $project: {
              "taskStatus.student": 1,
              "taskStatus.status": 1,
              "taskStatus._id": 1,
            },
          },
        ]);
        const currentIndex = taskStatusArr[0].taskStatus.findIndex(
          (value) => value.student === currentStudent.student
        );
        task.taskStatus[currentIndex].status = status;
      }
    }
    await task.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Status updated successfully"));
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
});

export {
  createTask,
  deleteTask,
  getTasks,
  getTasksBySemester,
  setStatus,
  updateTask,
  getTasksBySemesterStudents
};
