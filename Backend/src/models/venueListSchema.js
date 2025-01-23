import mongoose, { Schema } from "mongoose";

const venueListSchema = new Schema({
  venue: { type: String, required: true },
  year: { type: Number, required: true },
  url: { type: String },
  added_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date },
  abstract_submission: { type: Date },
  paper_submission: { type: Date },
  author_response: { type: Date },
  meta_review: { type: Date },
  notification: { type: Date },
  commitment: { type: Date },
  main_conference_start: { type: Date },
  main_conference_end: { type: Date },
  location: { type: String },
  time_zone: { type: String },
  view: { type: [Schema.Types.ObjectId], ref: "User" } // Array of User IDs
}, { timestamps: true });

export const VenueList = mongoose.model("VenueList", venueListSchema);
