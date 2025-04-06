import mongoose, { Schema } from "mongoose";

const supervisorSchema = new Schema({
  faculty_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  student_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  joining: { type: Date },
  thesis_title: { type: String },
  committee: { type: [Schema.Types.ObjectId], ref: "User" },
  stipend: { type: Schema.Types.Decimal128, min: 0 },
  funding_source: { type: String },
  srpId: { type: Schema.Types.ObjectId, ref: "SponsorProject", default: null }
}, { 
  timestamps: true 
});

// Create indexes
supervisorSchema.index({ faculty_id: 1 }); // All supervision relationships for a faculty
supervisorSchema.index({ student_id: 1 }); // Find student's supervisor
supervisorSchema.index({ faculty_id: 1, student_id: 1 }, { unique: true }); // Unique supervisor-student pairing
supervisorSchema.index({ committee: 1 }); // Find committees a faculty is part of
supervisorSchema.index({ srpId: 1 }); // Find all supervision under a sponsored project

// For thesis search functionality
supervisorSchema.index({ thesis_title: 'text' });

// For date-based queries
supervisorSchema.index({ joining: -1 }); // Recent supervision relationships first
supervisorSchema.index({ createdAt: -1 }); // Newly created records
supervisorSchema.index({ updatedAt: -1 }); // Recently modified records

// For financial reporting
supervisorSchema.index({ 
  funding_source: 1,
  stipend: 1 
});

// Compound index for faculty performance analysis
supervisorSchema.index({
  faculty_id: 1,
  joining: 1,
  srpId: 1
});

export const Supervisor = mongoose.model("Supervisor", supervisorSchema);