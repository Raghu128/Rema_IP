import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FinanceBudgetList from "../FinanceBudget/FinanceBudgetList";
import MinutesOfMeeting from "../MinutesOfMeeting/MinutesOfMeeting";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faBuilding, faLink, 
  faCheckCircle, faCalendarAlt, faClock, 
  faDollarSign, faComments, faTimes, 
  faSearch, faTable, faThLarge
} from '@fortawesome/free-solid-svg-icons';
import "../../styles/Sponsor/DisplaySponsors.css";

const DisplaySponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [filteredSponsors, setFilteredSponsors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedSponsor, setSelectedSponsor] = useState(null);
    const [showNotes, setShowNotes] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'cards' or 'table'
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
    }, [user.id]);

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = sponsors.filter((sponsor) =>
            sponsor.title.toLowerCase().includes(query) ||
            sponsor.agency.toLowerCase().includes(query)
        );
        setFilteredSponsors(filtered);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    if (loading) {
        return <Loader />;
    }

    if(showNotes) return (
        <div className="sponsor-notes-overlay">
            <div className="sponsor-notes-content">
                <button 
                    className="sponsor-close-notes-button" 
                    onClick={() => setShowNotes(null)}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <MinutesOfMeeting projectId={showNotes} />
                </div>
        </div>
    )
    

    return (
        <div className="display-sponsors-container">
            <div className="display-sponsors-header">
                <h2 className="display-sponsors-title">Sponsored Research Projects</h2>
                <div className="display-sponsors-actions">
                    <button
                        className={`view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
                        onClick={() => setViewMode('cards')}
                    >
                        <FontAwesomeIcon icon={faThLarge} /> Cards
                    </button>
                    <button
                        className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                    >
                        <FontAwesomeIcon icon={faTable} /> Table
                    </button>
                    <button
                        className="display-sponsor-manage-btn"
                        onClick={() => navigate("/manage-sponsor")}
                    >
                        <FontAwesomeIcon icon={faEdit} /> Manage
                    </button>
                </div>
            </div>

            <div className="display-sponsors-search-bar">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by title or agency..."
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
                        <FontAwesomeIcon icon={faTimes} /> Close Budget
                    </button>
                    <FinanceBudgetList srp_id={selectedSponsor} />
                </div>
            ) : (
                <>
                    {filteredSponsors.length > 0 ? (
                        viewMode === 'cards' ? (
                            <div className="sponsor-cards-container">
                                {filteredSponsors.map((sponsor) => (
                                    <div key={sponsor._id} className="sponsor-card">
                                        <div className="sponsor-card-header">
                                            <h3 className="sponsor-title">{sponsor.title}</h3>
                                            <span className={`sponsor-status ${sponsor.status.toLowerCase()}`}>
                                                {sponsor.status}
                                            </span>
                                        </div>
                                        <div className="sponsor-details">
                                            <div className="detail-row">
                                                <FontAwesomeIcon icon={faBuilding} className="detail-icon" />
                                                <span className="detail-label">Agency:</span>
                                                <span className="detail-value">{sponsor.agency}</span>
                                            </div>
                                            <div className="detail-row">
                                                <FontAwesomeIcon icon={faLink} className="detail-icon" />
                                                <span className="detail-label">CFP URL:</span>
                                                <a href={sponsor.cfp_url} target="_blank" rel="noopener noreferrer" className="detail-value link">
                                                    View CFP
                                                </a>
                                            </div>
                                            <div className="detail-row">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
                                                <span className="detail-label">Duration:</span>
                                                <span className="detail-value">
                                                    {new Date(sponsor.start_date).toLocaleDateString()} - {sponsor.duration}
                                                </span>
                                            </div>
                                            <div className="detail-row">
                                                <FontAwesomeIcon icon={faDollarSign} className="detail-icon" />
                                                <span className="detail-label">Budget:</span>
                                                <span 
                                                    className="detail-value clickable-budget"
                                                    onClick={() => setSelectedSponsor(sponsor._id)}
                                                >
                                                    {formatCurrency(parseFloat(sponsor.budget.$numberDecimal))}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="sponsor-card-footer">
                                            <button
                                                className="sponsor-notes-button"
                                                onClick={() => setShowNotes(showNotes === sponsor._id ? null : sponsor._id)}
                                            >
                                                <FontAwesomeIcon icon={faComments} /> 
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="sponsor-table-container">
                                <table className="sponsor-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Agency</th>
                                            <th>Status</th>
                                            <th>Start Date</th>
                                            <th>Duration</th>
                                            <th>Budget</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSponsors.map((sponsor) => (
                                            <tr key={sponsor._id}>
                                                <td>{sponsor.title}</td>
                                                <td>{sponsor.agency}</td>
                                                <td>
                                                    <span className={`status-badge ${sponsor.status.toLowerCase()}`}>
                                                        {sponsor.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(sponsor.start_date).toLocaleDateString()}</td>
                                                <td>{sponsor.duration}</td>
                                                <td 
                                                    className="clickable-budget"
                                                    onClick={() => setSelectedSponsor(sponsor._id)}
                                                >
                                                    {formatCurrency(parseFloat(sponsor.budget.$numberDecimal))}
                                                </td>
                                                <td className="actions-cell">
                                                    <button
                                                        className="table-notes-button"
                                                        onClick={() => setShowNotes(showNotes === sponsor._id ? null : sponsor._id)}
                                                    >
                                                        <FontAwesomeIcon icon={faComments} /> 
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : (
                        <div className="no-results-message">
                            <p>No sponsors found matching your search criteria.</p>
                            <button 
                                className="add-sponsor-btn"
                                onClick={() => navigate("/manage-sponsor")}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Add New Sponsor
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DisplaySponsors;