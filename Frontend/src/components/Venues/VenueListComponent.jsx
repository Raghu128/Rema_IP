import React, { useEffect, useState } from "react";
import "../../styles/Venues/VenueListComponent.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VenueListComponent = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
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
              <p>📅 {new Date(venue.date).toLocaleDateString()}</p>
              <p>⏳ Time Zone: {venue.time_zone || "Not specified"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueListComponent;
