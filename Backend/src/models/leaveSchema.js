import mongoose, { Schema } from "mongoose";

const leaveSchema = new Schema(
    {
        // The user requesting leave
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Start date of the leave
        from: {
            type: Date,
            required: true,
        },
        // End date of the leave
        to: {
            type: Date,
            required: true,
        },
        // Reason for the leave
        reason: {
            type: String,
            required: true,
        },
        appliedOnPortal: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Leave = mongoose.model("Leave", leaveSchema);
