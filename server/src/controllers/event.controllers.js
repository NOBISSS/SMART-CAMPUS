import { Event } from "../models/events.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const CreateEvent = asyncHandler(async (req,res) => {
    const {eventTitle,eventDisc,eventDate} = req.body;
    if ([eventTitle,eventDisc,eventDate].some((field) => {
        return field?.trim() === "";
    })) {
        throw new ApiError(400, "All fields are required");
    }
    const newEvent = await Event.create({
        EventHeading:eventTitle,
        EventDetails:eventDisc,
        EventDate:eventDate,
    })
})