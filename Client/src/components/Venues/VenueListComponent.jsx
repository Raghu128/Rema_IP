import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaChevronDown, FaChevronUp, FaCalendarAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Loader from "../Loader";
import "../../styles/Venues/VenueListComponent.css";

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

  const getDeadlineStatus = (dateString) => {
    if (dateString === "No upcoming deadlines") return "neutral";
    const deadline = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return "urgent";
    if (diffDays <= 30) return "warning";
    return "normal";
  };

  if (loading) return <Loader />;

  return (
    <div className="compact-venue-list-container">
      <div className="compact-venue-list-header">
        <button
          className="compact-manage-venue-btn"
          onClick={() => navigate("/edit-venue")}
          aria-label="Manage venues"
        >
          <FaEdit className="compact-edit-icon" />
        </button>
        <h3 className="compact-venue-list-title">Venues</h3>
      </div>

      {venues.length === 0 ? (
        <div className="compact-no-venues-message">
          <button
            className="compact-add-venue-btn"
            onClick={() => navigate("/edit-venue")}
          >
            + Add Venue
          </button>
        </div>
      ) : (
        <div className="compact-venue-table-container">
          {venues.map((venue) => (
            <div key={venue._id} className="compact-venue-card">
              <div className="compact-venue-card-header">
                <div className="compact-venue-info">
                  <div className="compact-venue-name">
                    <FaCalendarAlt className="compact-venue-icon" />
                    <span>{venue.venue}</span>
                  </div>
                  <div className="compact-venue-location">
                    <FaMapMarkerAlt className="compact-location-icon" />
                    <span>{venue.location}</span>
                  </div>
                  <div className="compact-url-item">
                    <a
                      href={venue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="compact-url-link"
                    >
                      {venue.url.replace(/^https?:\/\//, '').split('/')[0]}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedVenue(expandedVenue === venue._id ? null : venue._id)}
                  className="compact-expand-collapse-btn"
                  aria-label={expandedVenue === venue._id ? "Collapse details" : "Expand details"}
                >
                  {expandedVenue === venue._id ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              <div className="compact-venue-meta">
                <span className={`compact-deadline ${getDeadlineStatus(getNextDeadline(venue))}`}>
                  {getNextDeadline(venue)}
                </span>
                <span className="compact-added-by">
                  <FaUser className="compact-user-icon" />
                  {typeof venue.added_by === "object"
                    ? venue.added_by._id === user.id
                      ? "You"
                      : venue.added_by.name
                    : venue.added_by === user.id
                      ? "You"
                      : venue.added_by}
                </span>
              </div>

              {expandedVenue === venue._id && (
                <div className="compact-venue-details">
                  <div className="compact-detail-item">
                    <span className="compact-detail-label">Event Date:</span>
                    <span className="compact-detail-value">
                      {venue.date ? new Date(venue.date).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="compact-detail-item">
                    <span className="compact-detail-label">Time Zone:</span>
                    <span className="compact-detail-value">
                      {venue.time_zone || "Not specified"}
                    </span>
                  </div>
                  <div className="compact-detail-item">
                    <span className="compact-detail-label">Abstract:</span>
                    <span className="compact-detail-value">
                      {venue.abstract_submission ? new Date(venue.abstract_submission).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="compact-detail-item">
                    <span className="compact-detail-label">Paper:</span>
                    <span className="compact-detail-value">
                      {venue.paper_submission ? new Date(venue.paper_submission).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="compact-detail-item">
                    <span className="compact-detail-label">Response:</span>
                    <span className="compact-detail-value">
                      {venue.author_response ? new Date(venue.author_response).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="compact-detail-item">
                    <span className="compact-detail-label">Review:</span>
                    <span className="compact-detail-value">
                      {venue.meta_review ? new Date(venue.meta_review).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="compact-detail-item">
                    <span className="compact-detail-label">Notify:</span>
                    <span className="compact-detail-value">
                      {venue.notification ? new Date(venue.notification).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="compact-detail-item">
                    <span className="compact-detail-label">Commit:</span>
                    <span className="compact-detail-value">
                      {venue.commitment ? new Date(venue.commitment).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="compact-detail-item">
                    <span className="compact-detail-label">Start:</span>
                    <span className="compact-detail-value">
                      {venue.main_conference_start ? new Date(venue.main_conference_start).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="compact-detail-item">
                    <span className="compact-detail-label">End:</span>
                    <span className="compact-detail-value">
                      {venue.main_conference_end ? new Date(venue.main_conference_end).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueListComponent;