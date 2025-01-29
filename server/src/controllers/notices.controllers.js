import _ from "lodash";
import { Event } from "../models/events.model.js";
import { Notice } from "../models/notices.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const createNotice = asyncHandler(async (req, res) => {
  const { noticeTitle, noticeDisc, semester } = req.body;
  if (
    [noticeTitle, noticeDisc, semester].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const noticeImageLocalPath = req.file?.path; // Not req.files for single upload

  // console.log(noticeImageLocalPath);
  let noticeImage;
  try {
    if (noticeImageLocalPath) {
      noticeImage = await uploadOnCloudinary(noticeImageLocalPath);
    }
    // console.log(noticeImage);
  } catch (err) {
    throw new ApiError(500, { message: "Failed to upload noticeImage" });
  }
  try {
    const newNotice = await Notice.create({
      NoticeHeading: noticeTitle,
      semester: _.toNumber(semester),
      NoticeDetails: noticeDisc,
      NoticeImage: noticeImage?.secure_url || "",
    });
    // console.log(newNotice);
    const createdNotice = await Notice.findById(newNotice._id);
    if (!createdNotice) {
      throw new ApiError(500, {
        message: "Something went wrong while creating an notice",
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createdNotice, "notice Created Successfully"));
  } catch (err) {
    if (noticeImage) {
      await deleteFromCloudinary(noticeImage.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while creating notice and images were deleted"
    );
  }
});

const displayNotices = asyncHandler(async (req, res) => {
  const events = await Event.aggregate([
    {
      $project: {
        _id: 1,
        EventHeading: 1,
        EventDetails: 1,
        EventDate: 1,
        EventImage: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
  if (!events) {
    throw new ApiError(300, "No events found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        events,
        `${events.length} Events fetched successfully`
      )
    );
});
const displayNoticesStudents = asyncHandler(async (req, res) => {
  const events = await Event.aggregate([
    {
      $project: {
        _id: 1,
        EventHeading: 1,
        EventDetails: 1,
        EventDate: 1,
        EventImage: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
  if (!events) {
    throw new ApiError(300, "No events found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        events,
        `${events.length} Events fetched successfully`
      )
    );
});

const updateNotice = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { newTitle, newDesc, newDate } = req.body;
  if (
    [newTitle, newDesc, newDate].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // const event = await Event.findById(eventId);
  const eventImageLocalPath = req.file?.path; // Not req.files for single upload
  console.log(eventImageLocalPath);
  let eventImage;
  try {
    if (eventImageLocalPath) {
      eventImage = await uploadOnCloudinary(eventImageLocalPath);
    }
    console.log(eventImage);
  } catch (err) {
    throw new ApiError(500, { message: "Failed to upload EventImage" });
  }
  const event = await Event.findByIdAndUpdate(
    eventId,
    {
      $set: {
        EventHeading: newTitle,
        EventDetails: newDesc,
        EventDate: newDate,
        EventImage: eventImage?.secure_url,
      },
    },
    { new: true }
  );
  if (!event) {
    throw new ApiError(404, "Event Not found");
  }
  // if (event.EventImage) { //get logic from vidshare and change it later on.
  //   await deleteFromCloudinary(event.EventImage)
  // }
  await event.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event Updated successfully"));
});

const deleteNotice = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findByIdAndDelete(eventId);
  if (!event) throw new ApiError(404, "Event not found");
  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event Deleted Successfully"));
});

export {
  createNotice,
  deleteNotice,
  displayNotices,
  displayNoticesStudents,
  updateNotice,
};
