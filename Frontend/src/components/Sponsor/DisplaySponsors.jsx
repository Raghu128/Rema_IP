import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Sponsor/DisplaySponsors.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FinanceBudgetList from "../FinanceBudget/FinanceBudgetList";
import MinutesOfMeeting from "../MinutesOfMeeting/MinutesOfMeeting";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faBuilding, faLink, faCheckCircle, faCalendarAlt, faClock, faDollarSign, faComments, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';


const DisplaySponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [filteredSponsors, setFilteredSponsors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedSponsor, setSelectedSponsor] = useState(null);
    const [showNotes, setShowNotes] = useState(null);
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
                setSponsors(response.data);
                setFilteredSponsors(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching sponsors:", error);
                setLoading(false);
            }
        };

        fetchSponsors();
    }, [user.id]);  // Correct dependency

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = sponsors.filter((sponsor) =>
            sponsor.title.toLowerCase().includes(query)
        );
        setFilteredSponsors(filtered);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="display-sponsors-container">
            <div className="display-sponsors-header">
                <h2 className="display-sponsors-title">All Sponsors</h2>
                <button
                    className="display-sponsor-manage-btn"
                    onClick={() => navigate("/manage-sponsor")}
                >
                    Manage
                </button>
            </div>

            <div className="display-sponsors-search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {selectedSponsor ? (
              <div className="finance-budget-container">
                <button
                  className="close-budget-btn"
                  onClick={() => setSelectedSponsor(null)}
                >
                  <FontAwesomeIcon icon={faTimes} /> 
                </button>
                <FinanceBudgetList srp_id={selectedSponsor} />
              </div>
            ) : (
                <div className="sponsor-list">
                    {filteredSponsors.length > 0 ? (
                        filteredSponsors.map((sponsor) => (
                          <div key={sponsor._id} className="sponsor-card">
                            <h3 className="sponsor-title">{sponsor.title}</h3>
                            <div className="sponsor-details">
                              <p><FontAwesomeIcon icon={faBuilding} className="detail-icon" /> <strong>Agency:</strong> {sponsor.agency}</p>
                              <p><FontAwesomeIcon icon={faLink} className="detail-icon" /> <strong>CFP URL:</strong> <a href={sponsor.cfp_url} target="_blank" rel="noopener noreferrer">{sponsor.cfp_url}</a></p>
                              <p><FontAwesomeIcon icon={faCheckCircle} className="detail-icon" /> <strong>Status:</strong> {sponsor.status}</p>
                              <p><FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" /> <strong>Start Date:</strong> {new Date(sponsor.start_date).toLocaleDateString()}</p>
                              <p><FontAwesomeIcon icon={faClock} className="detail-icon" /> <strong>Duration:</strong> {sponsor.duration}</p>
                              <p>
                                <FontAwesomeIcon icon={faDollarSign} className="detail-icon" />
                                <strong>Budget:</strong>{" "}
                                <span
                                  className="clickable-budget"
                                  onClick={() => setSelectedSponsor(sponsor._id)}
                                >
                                  {sponsor.budget.$numberDecimal}
                                </span>
                              </p>
                              <p><FontAwesomeIcon icon={faComments} className="detail-icon" /> <strong>Remarks:</strong> {sponsor.remarks}</p>
                            </div>


                            <button
                              className="sponsor-notes-button"
                              onClick={() => setShowNotes(showNotes === sponsor._id ? null : sponsor._id)}
                            >
                              <FontAwesomeIcon icon={faComments} /> 
                            </button>

                            {showNotes === sponsor._id && (
                              <div className="sponsor-notes-overlay">
                                <div className="sponsor-notes-content">
                                  <button className="sponsor-close-notes-button" onClick={() => setShowNotes(null)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                  </button>
                                  <MinutesOfMeeting projectId={sponsor._id} />
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                    ) : (
                        <p className="no-sponsors-message">No sponsors available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DisplaySponsors;