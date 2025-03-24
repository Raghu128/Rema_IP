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
    },
    { timestamps: true }
);

export const Leave = mongoose.model("Leave", leaveSchema);
