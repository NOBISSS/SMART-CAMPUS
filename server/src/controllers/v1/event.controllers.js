import { Event } from "../../models/events.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../../utils/cloudinary.js";

const CreateEvent = asyncHandler(async (req, res) => {
  const { eventTitle, eventDisc, eventDate } = req.body;
  if (
    [eventTitle, eventDisc, eventDate].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, { message: "All fields are required" });
  }
  let eventImageLocalPath;
  eventImageLocalPath = req.file?.path; // Not req.files for single upload

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
  try {
    const newEvent = await Event.create({
      EventHeading: eventTitle,
      EventDetails: eventDisc,
      EventDate: eventDate,
      EventImage: eventImage?.secure_url || "",
    });

    const createdEvent = await Event.findById(newEvent._id);
    if (!createdEvent) {
      throw new ApiError(500, {
        message: "Something went wrong while creating an event",
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createdEvent, "Event Created Successfully"));
  } catch (err) {
    if (eventImage) {
      await deleteFromCloudinary(eventImage.public_id);
    }
    throw new ApiError(500, {
      message:
        "Something went wrong while creating event and images were deleted",
    });
  }
});

const displayEvents = asyncHandler(async (req, res) => {
  try {
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
      throw new ApiError(300, { message: "No events found" });
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
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
});
const displayEventsStudents = asyncHandler(async (req, res) => {
  try {
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
      throw new ApiError(300, { message: "No events found" });
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
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
});

const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { newTitle, newDesc, newDate } = req.body;
  if (
    [newTitle, newDesc, newDate].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, { message: "All fields are required" });
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
  try {
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
      throw new ApiError(404, { message: "Event Not found" });
    }
    // if (event.EventImage) { //get logic from vidshare and change it later on.
    //   await deleteFromCloudinary(event.EventImage)
    // }
    await event.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, event, "Event Updated successfully"));
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) throw new ApiError(404, { message: "Event not found" });
    return res
      .status(200)
      .json(new ApiResponse(200, event, "Event Deleted Successfully"));
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
});

export {
  CreateEvent,
  deleteEvent,
  displayEvents,
  displayEventsStudents,
  updateEvent,
};
