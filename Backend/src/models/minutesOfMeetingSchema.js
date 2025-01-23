import mongoose, { Schema } from "mongoose";

const minutesOfMeetingSchema = new Schema({
  pid: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  text: { type: String, required: true },
  added_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

export const MinutesOfMeeting = mongoose.model("MinutesOfMeeting", minutesOfMeetingSchema);
