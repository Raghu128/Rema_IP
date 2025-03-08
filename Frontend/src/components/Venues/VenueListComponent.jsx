import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Venues/VenueListComponent.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

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
          const response = await axios.get(`/api/v1/venues/${user.id}`);
          // Assuming API returns an object with property "venues"
          setVenues(response.data.venues);
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

  if (loading) return <Loader />;

  return (
    <div className="venue-list-container">
      <div className="venue-list-header">
      <button className="manage-venue-btn" onClick={() => navigate("/edit-venue")}>
        ✏️ 
      </button>
      <h2 className="venue-list-title">Venue List</h2>
      </div>
      {venues.length === 0 ? (
        <div className="no-venues">No venues found.</div>
      ) : (
        <table className="venue-table">
          <thead>
            <tr>
              <th>Venue</th>
              <th>Location</th>
              <th>Next Deadline</th>
              <th>Added By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {venues.map((venue) => (
    <React.Fragment key={venue._id}>
      <tr className="venue-row">
        <td> {venue.venue}</td>
        <td> {venue.location}</td>
        <td> {getNextDeadline(venue)}</td>
        <td>
          👤{" "}
          {typeof venue.added_by === "object"
            ? venue.added_by._id === user.id
              ? "Self"
              : venue.added_by.name
            : venue.added_by === user.id
            ? "Self"
            : venue.added_by}
        </td>
        <td>
          <button
            onClick={() => setExpandedVenue(expandedVenue === venue._id ? null : venue._id)}
            className={expandedVenue === venue._id ? "collapse-btn" : "expand-btn"}
          >
            {expandedVenue === venue._id ? " ▲" : " ▼"}
          </button>
        </td>
      </tr>
      {expandedVenue === venue._id && (
        <tr className="venue-details-row">
          <td colSpan="5">
            <div className="venue-details">
              <p> Event Date: {new Date(venue.date).toLocaleDateString()}</p>
              <p> Time Zone: {venue.time_zone || "Not specified"}</p>
              <p> Abstract Submission: {venue.abstract_submission ? new Date(venue.abstract_submission).toLocaleDateString() : "N/A"}</p>
              <p> Paper Submission: {venue.paper_submission ? new Date(venue.paper_submission).toLocaleDateString() : "N/A"}</p>
              <p> Author Response: {venue.author_response ? new Date(venue.author_response).toLocaleDateString() : "N/A"}</p>
              <p> Meta Review: {venue.meta_review ? new Date(venue.meta_review).toLocaleDateString() : "N/A"}</p>
              <p> Notification: {venue.notification ? new Date(venue.notification).toLocaleDateString() : "N/A"}</p>
              <p> Commitment: {venue.commitment ? new Date(venue.commitment).toLocaleDateString() : "N/A"}</p>
              <p> Conference Start: {venue.main_conference_start ? new Date(venue.main_conference_start).toLocaleDateString() : "N/A"}</p>
              <p> Conference End: {venue.main_conference_end ? new Date(venue.main_conference_end).toLocaleDateString() : "N/A"}</p>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
        </table>
      )}
    </div>
  );
};

export default VenueListComponent;
