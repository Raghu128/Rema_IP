import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../styles/Sponsor/DisplaySponsors.css';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FinanceBudgetList from "../FinanceBudget/FinanceBudgetList";

const DisplaySponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState(null); // Track selected sponsor for budget details
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all sponsors from backend API
    const fetchSponsors = async () => {
      try {
        const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
        setSponsors(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  // If loading, show a loading indicator
  if (loading) {
    return <div>Loading sponsors...</div>;
  }

  return (
    <div className="display-sponsors-container">
      <button className="display-sponsor-mangage-btn" onClick={() => navigate("/manage-sponsor")}>
        Manage
      </button>
      <h2 className="display-sponsors-heading">All Sponsors</h2>

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
              marginBottom: "10px"
            }}
          >
            Close
          </button>
          <FinanceBudgetList srp_id={selectedSponsor} />
        </div>
      ) : (
        <>
          {sponsors.length > 0 ? (
            <div className="sponsor-list">
              {sponsors.map((sponsor) => (
                <div key={sponsor._id} className="sponsor-item">
                  <h3 className="sponsor-title">{sponsor.title}</h3>
                  <p><strong>Agency:</strong> {sponsor.agency}</p>
                  <p><strong>CFP URL:</strong> <a href={sponsor.cfp_url} target="_blank" rel="noopener noreferrer">{sponsor.cfp_url}</a></p>
                  <p><strong>Status:</strong> {sponsor.status}</p>
                  <p><strong>Start Date:</strong> {new Date(sponsor.start_date).toISOString().split("T")[0]}</p>
                  <p><strong>Duration:</strong> {sponsor.duration}</p>
                  <p>
                    <strong>Budget:</strong>{" "}
                    <span
                      className="clickable-budget"
                      onClick={() => setSelectedSponsor(sponsor._id)}
                      style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                    >
                      {sponsor.budget.$numberDecimal}
                    </span>
                  </p>
                  <p><strong>Remarks:</strong> {sponsor.remarks}</p>
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
