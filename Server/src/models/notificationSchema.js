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

notificationSchema.index({ added_by: 1 }); // Notifications by creator
notificationSchema.index({ view: 1 }); // Notifications viewed by user
notificationSchema.index({ 
  due_date: 1 
}); // Upcoming deadlines
notificationSchema.index({ 
  priority: 1, 
  creation_date: -1 
}); // High priority recent notifications
notificationSchema.index({ 
  type: 1, 
  creation_date: -1 
}); // Notification type filtering

export const Notification = mongoose.model("Notification", notificationSchema);
