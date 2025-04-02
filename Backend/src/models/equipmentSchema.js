import mongoose, { Schema } from "mongoose";

const equipmentSchema = new Schema({
  name: { type: String, required: true },
  ownership: { type: Schema.Types.ObjectId, ref: "User", required: true },
  funding_by_srp_id: { type: Schema.Types.ObjectId, ref: "SponsorProject"},
  date_of_purchase: { type: Date },
  location: { type: String },
  usingUser: { type: Schema.Types.ObjectId, ref: "User"},
  amount: { type: Schema.Types.Decimal128, min: 0 },
  status: { type: String, default: "available", enum: ['available', 'in use', 'maintenance', 'surrendered'] },
  remarks: { type: String }
}, { timestamps: true });


export const Equipment = mongoose.model("Equipment", equipmentSchema);
