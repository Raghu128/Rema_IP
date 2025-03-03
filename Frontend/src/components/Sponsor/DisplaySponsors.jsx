import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Sponsor/DisplaySponsors.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FinanceBudgetList from "../FinanceBudget/FinanceBudgetList";
import MinutesOfMeeting from "../MinutesOfMeeting/MinutesOfMeeting"; // Import the MinutesOfMeeting component
import Loader from '../Loader'

const DisplaySponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [filteredSponsors, setFilteredSponsors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [showNotes, setShowNotes] = useState(null); // Track which sponsor’s notes are open
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
        setSponsors(response.data);
        setFilteredSponsors(response.data); // Initialize filtered list
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = sponsors.filter((sponsor) =>
      sponsor.title.toLowerCase().includes(query)
    );
    setFilteredSponsors(filtered);
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="display-sponsors-container">
      <button
        className="display-sponsor-manage-btn"
        onClick={() => navigate("/manage-sponsor")}
      >
        Manage
      </button>

      <h2 className="display-sponsors-heading">All Sponsors</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title..."
        className="sponsor-search-bar"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {selectedSponsor ? (
        <div className="finance-budget-container">
          <button
            className="close-budget-btn"
            onClick={() => setSelectedSponsor(null)}
            style={{
              background: "red",
              color: "white",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            Close
          </button>
          <FinanceBudgetList srp_id={selectedSponsor} />
        </div>
      ) : (
        <>
          {filteredSponsors.length > 0 ? (
            <div className="sponsor-list">
              {filteredSponsors.map((sponsor) => (
                <div key={sponsor._id} className="sponsor-item">
                  <h3 className="sponsor-title">{sponsor.title}</h3>
                  <p>
                    <strong>Agency:</strong> {sponsor.agency}
                  </p>
                  <p>
                    <strong>CFP URL:</strong>{" "}
                    <a
                      href={sponsor.cfp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sponsor.cfp_url}
                    </a>
                  </p>
                  <p>
                    <strong>Status:</strong> {sponsor.status}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(sponsor.start_date).toISOString().split("T")[0]}
                  </p>
                  <p>
                    <strong>Duration:</strong> {sponsor.duration}
                  </p>
                  <p>
                    <strong>Budget:</strong>{" "}
                    <span
                      className="clickable-budget"
                      onClick={() => setSelectedSponsor(sponsor._id)}
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {sponsor.budget.$numberDecimal}
                    </span>
                  </p>
                  <p>
                    <strong>Remarks:</strong> {sponsor.remarks}
                  </p>

                  {/* Notes Button */}
                  <span 
                    className="sponsor-notes-button" 
                    onClick={() => setShowNotes(showNotes === sponsor._id ? null : sponsor._id)}
                  >
                    Notes
                  </span>

                  {/* Notes Overlay */}
                  {showNotes === sponsor._id && (
                    <div className="sponsor-notes-overlay">
                      <div className="sponsor-notes-content">
                        <button
                          className="sponsor-close-notes-button"
                          onClick={() => setShowNotes(null)}
                          
                        >
                          ✖
                        </button>
                        <MinutesOfMeeting projectId={sponsor._id} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No sponsors available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default DisplaySponsors;
