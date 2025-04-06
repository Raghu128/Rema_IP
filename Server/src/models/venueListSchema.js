import mongoose, { Schema } from "mongoose";

const venueListSchema = new Schema({
  venue: { type: String, required: true },
  year: { type: Number, required: true },
  url: { type: String },
  added_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
  view: { type: [Schema.Types.ObjectId], ref: "User" }},
  { timestamps: true }
);

// Create indexes
venueListSchema.index({ venue: 1 }); // Basic search by venue name
venueListSchema.index({ year: -1 }); // Most recent conferences first
venueListSchema.index({ venue: 1, year: -1 }); // Compound index for venue+year queries
venueListSchema.index({ added_by: 1 }); // For finding venues added by specific users
venueListSchema.index({ location: 1 }); // For location-based queries

// Date-related indexes (for upcoming deadlines/conferences)
venueListSchema.index({ abstract_submission: 1 });
venueListSchema.index({ paper_submission: 1 });
venueListSchema.index({ notification: 1 });
venueListSchema.index({ main_conference_start: 1 });

// For date range queries
venueListSchema.index({ 
  main_conference_start: 1,
  main_conference_end: 1 
});

// For tracking viewed venues by users
venueListSchema.index({ view: 1 });

// Text index for full-text search across multiple fields
venueListSchema.index({
  venue: 'text',
  location: 'text',
  time_zone: 'text'
}, {
  weights: {
    venue: 3,    // Highest priority
    location: 2, // Medium priority
    time_zone: 1 // Lowest priority
  },
  name: 'venue_search_index'
});

export const VenueList = mongoose.model("VenueList", venueListSchema);