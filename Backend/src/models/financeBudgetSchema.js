import mongoose, { Schema } from "mongoose";

const financeBudgetSchema = new Schema({
  srp_id: { type: Schema.Types.ObjectId, ref: "SponsorProject", required: true },
  year: { type: Number, required: true },
  manpower: { type: Schema.Types.Decimal128, min: 0 },
  pi_compenstion: { type: Schema.Types.Decimal128, min: 0 },
  equipment: { type: Schema.Types.Decimal128, min: 0 },
  travel: { type: Schema.Types.Decimal128, min: 0 },
  expenses: { type: Schema.Types.Decimal128, min: 0 },
  outsourcing: { type: Schema.Types.Decimal128, min: 0 },
  contingency: { type: Schema.Types.Decimal128, min: 0 },
  consumable: { type: Schema.Types.Decimal128, min: 0 },
  others: { type: Schema.Types.Decimal128, min: 0 },
  overhead: { type: Schema.Types.Decimal128, min: 0 },
  gst: { type: Schema.Types.Decimal128, min: 0 },
  status: { type: String, default: "pending", enum: ['approved', 'pending', 'rejected'] }
}, { timestamps: true });

export const FinanceBudget = mongoose.model("FinanceBudget", financeBudgetSchema);
