import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema({
  srp_id: { type: Schema.Types.ObjectId, ref: "SponsorProject", required: true },
  item: { type: String, required: true },
  amount: { type: Schema.Types.Decimal128, required: true, min: 0 },
  head: { type: String },
  payment_date: { type: Date }
}, { timestamps: true });

export const Expense = mongoose.model("Expense", expenseSchema);
