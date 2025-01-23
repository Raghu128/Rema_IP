const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'faculty', 'admin'] },
  status: { type: Boolean, default: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const sponsorProjectSchema = new mongoose.Schema({
  agency: { type: String, required: true },
  title: { type: String, required: true },
  cfp_url: { type: String },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] },
  start_date: { type: Date },
  duration: { type: Number, min: 1 },
  budget: { type: mongoose.Types.Decimal128, min: 0 },
  remarks: { type: String },
});

const supervisorSchema = new mongoose.Schema({
  faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joining: { type: Date },
  thesis_title: { type: String },
  committee: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' },
  stipend: { type: mongoose.Types.Decimal128, min: 0 },
  funding_source: { type: String },
  srpId: { type: mongoose.Schema.Types.ObjectId, ref: 'SponsorProject' },
});

const projectSchema = new mongoose.Schema({
  faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  domain: { type: String },
  sub_domain: { type: String },
  creation_date: { type: Date },
  end_date: { type: Date },
  team: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' },
  lead_author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'ongoing', enum: ['ongoing', 'completed', 'cancelled'] },
  venue: { type: String },
  date_of_submission: { type: Date },
  next_deadline: { type: Date },
  remarks: { type: String },
  paper_url: { type: String },
  submission_url: { type: String },
});

const minutesOfMeetingSchema = new mongoose.Schema({
  pid: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  text: { type: String, required: true },
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
});

const venueListSchema = new mongoose.Schema({
  venue: { type: String, required: true },
  year: { type: Number, required: true },
  url: { type: String },
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date },
  abstract_submission: { type: Date },
  paper_submission: { type: Date },
  author_response: { type: Date },
  meta_review: { type: Date },
  notification: { type: Date },
  commitment: { type: Date },
  main_conference_start: { type: Date },
  main_conference_end: { type: Date },
  location: { type: String },
  time_zone: { type: String },
  view: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' },
});

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  text: { type: String, required: true },
  creation_date: { type: Date, required: true },
  due_date: { type: Date },
  priority: { type: String, default: 'low', enum: ['low', 'medium', 'high'] },
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  view: { type: Object }, // JSON of user IDs with read status
});

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownership: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  funding_by_srp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SponsorProject' },
  date_of_purchase: { type: Date },
  location: { type: String },
  amount: { type: mongoose.Types.Decimal128, min: 0 },
  status: { type: String, default: 'available', enum: ['available', 'in use', 'maintenance', 'surrendered'] },
  remarks: { type: String },
});

const financeBudgetSchema = new mongoose.Schema({
  srp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SponsorProject', required: true },
  year: { type: Number, required: true },
  manpower: { type: mongoose.Types.Decimal128, min: 0 },
  pi_compenstion: { type: mongoose.Types.Decimal128, min: 0 },
  equipment: { type: mongoose.Types.Decimal128, min: 0 },
  travel: { type: mongoose.Types.Decimal128, min: 0 },
  expenses: { type: mongoose.Types.Decimal128, min: 0 },
  outsourcing: { type: mongoose.Types.Decimal128, min: 0 },
  contingency: { type: mongoose.Types.Decimal128, min: 0 },
  consumable: { type: mongoose.Types.Decimal128, min: 0 },
  others: { type: mongoose.Types.Decimal128, min: 0 },
  overhead: { type: mongoose.Types.Decimal128, min: 0 },
  gst: { type: mongoose.Types.Decimal128, min: 0 },
  status: { type: String, default: 'pending', enum: ['approved', 'pending', 'rejected'] },
});

const expenseSchema = new mongoose.Schema({
  srp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SponsorProject', required: true },
  item: { type: String, required: true },
  amount: { type: mongoose.Types.Decimal128, required: true, min: 0 },
  head: { type: String },
  payment_date: { type: Date },
});

module.exports = {
  User: mongoose.model('User', userSchema),
  SponsorProject: mongoose.model('SponsorProject', sponsorProjectSchema),
  Supervisor: mongoose.model('Supervisor', supervisorSchema),
  Project: mongoose.model('Project', projectSchema),
  MinutesOfMeeting: mongoose.model('MinutesOfMeeting', minutesOfMeetingSchema),
  VenueList: mongoose.model('VenueList', venueListSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Equipment: mongoose.model('Equipment', equipmentSchema),
  FinanceBudget: mongoose.model('FinanceBudget', financeBudgetSchema),
  Expense: mongoose.model('Expense', expenseSchema),
};
