import mongoose, { Schema } from "mongoose";
/* 
     1.EventHeading
     2.EventDetails
     3.EventDateTime
     4.UpdatedEventDateTime
     5.EventDate
*/
const eventSchema = new Schema(
  {
    EventHeading: {
      type: String,
      required: true,
    },
    EventDetails: {
      type: String,
      required: true,
    },
    EventDate: {
      type: Date,
      default: Date.now(),
      required: true,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
