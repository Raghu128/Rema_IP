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
  submission_url: { type: String },
  // Add this new field to track when each team member last viewed notes
  lastViewedNotes: {
    type: Map,       // Map of user IDs to dates
    of: Date,        // Values are dates
    default: {}      // Default empty map
  },
}, { timestamps: true });

projectSchema.index({ "lastViewedNotes": 1 });
projectSchema.index({ faculty_id: 1 }); // PI's projects
projectSchema.index({ team: 1 }); // User's project involvement
projectSchema.index({ status: 1 }); // Project status filter
projectSchema.index({ 
  creation_date: -1 
}); // New projects first
projectSchema.index({ 
  domain: 1, 
  sub_domain: 1 
}); // Research area filtering
projectSchema.index({ 
  next_deadline: 1 
}); // Upcoming deadlines
projectSchema.index({ 
  lead_author: 1, 
  status: 1 
}); // Lead author's active projects
projectSchema.index({ 
  name: 'text',
  domain: 'text',
  remarks: 'text'
}); // Full-text project search

export const Project = mongoose.model("Project", projectSchema);
