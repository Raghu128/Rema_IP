import mongoose, { Schema } from "mongoose";

const minutesOfMeetingSchema = new Schema({
  pid: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  text: { type: String, required: true },
  added_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

minutesOfMeetingSchema.index({ pid: 1 }); // All minutes for a project
minutesOfMeetingSchema.index({ added_by: 1 }); // Minutes by recorder
minutesOfMeetingSchema.index({ 
  date: -1 
}); // Recent meetings first
minutesOfMeetingSchema.index({ 
  pid: 1, 
  date: -1 
}); // Project meeting timeline
minutesOfMeetingSchema.index({ 
  text: 'text' 
}); // Full-text minute search

export const MinutesOfMeeting = mongoose.model("MinutesOfMeeting", minutesOfMeetingSchema);
