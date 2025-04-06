import mongoose, { Schema } from "mongoose";

const sponsorProjectSchema = new Schema({
  faculty_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  agency: { type: String, required: true },
  title: { type: String, required: true },
  cfp_url: { type: String },
  status: { type: String, default: "active", enum: ['active', 'inactive'] },
  start_date: { type: Date },
  duration: { type: Number, min: 1 },
  budget: { type: Schema.Types.Decimal128, min: 0 },
  remarks: { type: String }
}, { timestamps: true });

sponsorProjectSchema.index({ faculty_id: 1 }); // PI's projects
sponsorProjectSchema.index({ agency: 1 }); // Projects by funding agency
sponsorProjectSchema.index({ status: 1 }); // Active/inactive projects
sponsorProjectSchema.index({ 
  start_date: -1 
}); // Recent projects first
sponsorProjectSchema.index({ 
  title: 'text',
  agency: 'text',
  remarks: 'text'
}); // Full-text project search
sponsorProjectSchema.index({ 
  faculty_id: 1, 
  status: 1 
}); // PI's active projects

export const SponsorProject = mongoose.model("SponsorProject", sponsorProjectSchema);
