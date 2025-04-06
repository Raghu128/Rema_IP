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


// Create indexes
financeBudgetSchema.index({ srp_id: 1 }); // All budgets for a project
financeBudgetSchema.index({ year: -1 }); // Recent years first
financeBudgetSchema.index({ status: 1 }); // Filter by approval status
financeBudgetSchema.index({ 
  srp_id: 1, 
  year: -1 
}, { unique: true }); // Unique project-year combination

// Budget analysis indexes
financeBudgetSchema.index({ 
  srp_id: 1,
  status: 1,
  year: -1
}); // Approved budgets for projects

financeBudgetSchema.index({
  year: 1,
  status: 1
}); // Yearly budget approvals

// Financial summary indexes
financeBudgetSchema.index({
  createdAt: -1
}); // Newest budgets first

financeBudgetSchema.index({
  updatedAt: -1
}); // Recently modified budgets

export const FinanceBudget = mongoose.model("FinanceBudget", financeBudgetSchema);
