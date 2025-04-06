import mongoose, { Schema } from "mongoose";

const leaveSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        faculty_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        from: {
            type: Date,
            required: true,
        },
        to: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        appliedOnPortal: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'declined'],
            default: 'pending'
          }
    },
    { timestamps: true }
);


leaveSchema.index({ user_id: 1 }); // All leaves by user
leaveSchema.index({ faculty_id: 1 }); // Leaves to approve
leaveSchema.index({ 
  from: 1, 
  to: 1 
}); // Date range queries
leaveSchema.index({ 
  user_id: 1, 
  from: -1 
}); // User's leave history
leaveSchema.index({ 
  faculty_id: 1, 
  status: 1 
}); // Pending approvals


export const Leave = mongoose.model("Leave", leaveSchema);
