import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../styles/Sponsor/DisplaySponsors.css'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DisplaySponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch all sponsors from backend API
    const fetchSponsors = async () => {
      try {
        const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`); // Replace with your backend API URL
        setSponsors(response.data);
        console.log(response.data);
        
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
        <button className="display-sponsor-mangage-btn" onClick={() => navigate("/manage-sponsor")}>Manage</button>
      <h2 className="display-sponsors-heading">All Sponsors</h2>

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
              <p><strong>Budget:</strong> {sponsor.budget.$numberDecimal}</p>
              <p><strong>Remarks:</strong> {sponsor.remarks}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No sponsors available.</p>
      )}
    </div>
  );
};

export default DisplaySponsors;
