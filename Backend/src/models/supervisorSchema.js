import mongoose, { Schema } from "mongoose";

const supervisorSchema = new Schema({
  faculty_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  student_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  joining: { type: Date },
  thesis_title: { type: String },
  committee: { type: [Schema.Types.ObjectId], ref: "User" }, // Array of faculty IDs
  stipend: { type: Schema.Types.Decimal128, min: 0 },
  funding_source: { type: String },
  srpId: { type: Schema.Types.ObjectId, ref: "SponsorProject" }
}, { timestamps: true });

export const Supervisor = mongoose.model("Supervisor", supervisorSchema);
