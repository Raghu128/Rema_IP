import mongoose, { Schema } from "mongoose";

const sponsorProjectSchema = new Schema({
  agency: { type: String, required: true },
  title: { type: String, required: true },
  cfp_url: { type: String },
  status: { type: String, default: "active", enum: ['active', 'inactive'] },
  start_date: { type: Date },
  duration: { type: Number, min: 1 },
  budget: { type: Schema.Types.Decimal128, min: 0 },
  remarks: { type: String }
}, { timestamps: true });

export const SponsorProject = mongoose.model("SponsorProject", sponsorProjectSchema);
