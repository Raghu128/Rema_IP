import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  type: { type: String, required: true },
  text: { type: String, required: true },
  creation_date: { type: Date, required: true },
  due_date: { type: Date },
  priority: { type: String, default: "low", enum: ['low', 'medium', 'high'] },
  added_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  view: { type: [Schema.Types.ObjectId], ref: "User" } // Array of User IDs
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);
