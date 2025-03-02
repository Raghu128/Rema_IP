import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Venues/VenueListComponent.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VenueListComponent = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVenue, setExpandedVenue] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      const fetchVenues = async () => {
        try {
          const response = await fetch(`/api/v1/venues/${user.id}`);
          if (!response.ok) throw new Error("Failed to fetch venues");
          const data = await response.json();
          setVenues(data.venues);
        } catch (error) {
          console.error("Error fetching venues:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVenues();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Function to calculate the next upcoming deadline from available date fields
  const getNextDeadline = (venue) => {
    const dateFields = [
      "abstract_submission",
      "paper_submission",
      "author_response",
      "meta_review",
      "notification",
      "commitment",
      "main_conference_start",
      "main_conference_end",
    ];

    const upcomingDates = dateFields
      .map((field) => (venue[field] ? new Date(venue[field]) : null))
      .filter((date) => date && date > new Date())
      .sort((a, b) => a - b);

    return upcomingDates.length > 0
      ? upcomingDates[0].toLocaleDateString()
      : "No upcoming deadlines";
  };

  return (
    <div className="venue-list-container">
      <button className="manage-venue-btn" onClick={() => navigate(`/edit-venue`)}>
        ✏️ Manage Venues
      </button>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : venues.length === 0 ? (
        <div className="no-venues">No venues found.</div>
      ) : (
        <div className="venue-grid">
          {venues.map((venue) => (
            <div key={venue._id} className="venue-card">
              <h3>📍 {venue.venue}</h3>
              <p>📌 {venue.location}</p>
              <p>📅 Next Deadline: {getNextDeadline(venue)}</p>
              <p>
                👤 Added By:{" "}
                {typeof venue.added_by === "object"
                  ? venue.added_by._id === user.id
                    ? "Self"
                    : venue.added_by.name
                  : venue.added_by === user.id
                  ? "Self"
                  : venue.added_by}
              </p>

              {expandedVenue === venue._id ? (
                <div className="venue-details">
                  <p>📅 Event Date: {new Date(venue.date).toLocaleDateString()}</p>
                  <p>⏳ Time Zone: {venue.time_zone || "Not specified"}</p>
                  <p>
                    📝 Abstract Submission:{" "}
                    {venue.abstract_submission
                      ? new Date(venue.abstract_submission).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    📄 Paper Submission:{" "}
                    {venue.paper_submission
                      ? new Date(venue.paper_submission).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    📢 Author Response:{" "}
                    {venue.author_response
                      ? new Date(venue.author_response).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    🔎 Meta Review:{" "}
                    {venue.meta_review
                      ? new Date(venue.meta_review).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    📩 Notification:{" "}
                    {venue.notification
                      ? new Date(venue.notification).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    ✅ Commitment:{" "}
                    {venue.commitment
                      ? new Date(venue.commitment).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    🎤 Conference Start:{" "}
                    {venue.main_conference_start
                      ? new Date(venue.main_conference_start).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    🏁 Conference End:{" "}
                    {venue.main_conference_end
                      ? new Date(venue.main_conference_end).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <button onClick={() => setExpandedVenue(null)} className="collapse-btn">
                    Less
                  </button>
                </div>
              ) : (
                <button onClick={() => setExpandedVenue(venue._id)} className="expand-btn">
                  More
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueListComponent;
