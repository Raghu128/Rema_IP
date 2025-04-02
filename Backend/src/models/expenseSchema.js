import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema({
  srp_id: { type: Schema.Types.ObjectId, ref: "SponsorProject", required: true },
  item: { type: String, required: true },
  amount: { type: Schema.Types.Decimal128, required: true, min: 0 },
  head: { type: String },
  payment_date: { type: Date }
}, { timestamps: true });

expenseSchema.index({ srp_id: 1 }); // All expenses for a project
expenseSchema.index({ payment_date: -1 }); // Recent payments first
expenseSchema.index({ head: 1 }); // Expense category lookups
expenseSchema.index({ 
  srp_id: 1, 
  payment_date: 1 
}); // Project expense timeline
expenseSchema.index({ amount: 1 }); // For financial analysis
expenseSchema.index({ 
  createdAt: -1 
}); // Newly added expenses

export const Expense = mongoose.model("Expense", expenseSchema);
