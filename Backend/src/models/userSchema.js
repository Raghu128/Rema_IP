import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['btech', 'faculty', 'admin', 'intern','mtech','phd','projectstaff'] },
  status: { type: Boolean, default: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
