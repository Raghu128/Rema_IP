import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
  faculty_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  domain: { type: String },
  sub_domain: { type: String },
  creation_date: { type: Date },
  end_date: { type: Date },
  team: { type: [Schema.Types.ObjectId], ref: "User" }, // Array of student IDs
  lead_author: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "ongoing", enum: ['ongoing', 'completed', 'cancelled'] },
  venue: { type: String },
  date_of_submission: { type: Date },
  next_deadline: { type: Date },
  remarks: { type: String },
  paper_url: { type: String },
  submission_url: { type: String }
}, { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);
