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
  faSearch, faTable, faThLarge, faFileContract,
  faChartLine, faUserTie, faHandshake, faRupeeSign
} from '@fortawesome/free-solid-svg-icons';
import "../../styles/Sponsor/DisplaySponsors.css";

const DisplaySponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [filteredSponsors, setFilteredSponsors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedSponsor, setSelectedSponsor] = useState(null);
    const [showNotes, setShowNotes] = useState(null);
    const [viewMode, setViewMode] = useState('table');
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        completed: 0,
        proposed: 0
    });
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
                const data = response.data;
                setSponsors(data);
                setFilteredSponsors(data);
                
                // Calculate stats
                const stats = {
                    total: data.length,
                    active: data.filter(p => p.status === 'active').length,
                    completed: data.filter(p => p.status === 'completed').length,
                    proposed: data.filter(p => p.status === 'proposed').length
                };
                setStats(stats);
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
            sponsor.agency.toLowerCase().includes(query) ||
            (sponsor.contact_person && sponsor.contact_person.toLowerCase().includes(query))
        );
        setFilteredSponsors(filtered);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            // style: 'currency',
            // currency: 'INR',
            // minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <Loader />;
    }

    if(showNotes) return (
        <div className="sponsor-notes-overlay">
            <div className="sponsor-notes-content">
                <div className="sponsor-notes-header">
                    <h3>Meeting Minutes</h3>
                    <button 
                        className="sponsor-close-notes" 
                        onClick={() => setShowNotes(null)}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <MinutesOfMeeting projectId={showNotes} />
            </div>
        </div>
    );

    return (
        <div className="sponsor-container">
            <div className="sponsor-wrapper">
                <div className="sponsor-header">
                    <div className="sponsor-header-left">
                        <h1 className="sponsor-title">
                            <div className="sponsor-title-icon-wrapper">
                                <FontAwesomeIcon icon={faHandshake} className="sponsor-title-icon" />
                            </div>
                            Sponsored Research Projects
                        </h1>
                        <div className="sponsor-stats-container">
                            <div className="sponsor-stat-card sponsor-total">
                                <div className="sponsor-stat-icon-wrapper">
                                    <FontAwesomeIcon icon={faFileContract} className="sponsor-stat-icon" />
                                </div>
                                <div className="sponsor-stat-content">
                                    <span className="sponsor-stat-number">{stats.total}</span>
                                    <span className="sponsor-stat-label">Total Projects</span>
                                </div>
                            </div>
                            <div className="sponsor-stat-card sponsor-active">
                                <div className="sponsor-stat-icon-wrapper">
                                    <FontAwesomeIcon icon={faChartLine} className="sponsor-stat-icon" />
                                </div>
                                <div className="sponsor-stat-content">
                                    <span className="sponsor-stat-number">{stats.active}</span>
                                    <span className="sponsor-stat-label">Active</span>
                                </div>
                            </div>
                            <div className="sponsor-stat-card sponsor-completed">
                                <div className="sponsor-stat-icon-wrapper">
                                    <FontAwesomeIcon icon={faCheckCircle} className="sponsor-stat-icon" />
                                </div>
                                <div className="sponsor-stat-content">
                                    <span className="sponsor-stat-number">{stats.completed}</span>
                                    <span className="sponsor-stat-label">Completed</span>
                                </div>
                            </div>
                            <div className="sponsor-stat-card sponsor-proposed">
                                <div className="sponsor-stat-icon-wrapper">
                                    <FontAwesomeIcon icon={faUserTie} className="sponsor-stat-icon" />
                                </div>
                                <div className="sponsor-stat-content">
                                    <span className="sponsor-stat-number">{stats.proposed}</span>
                                    <span className="sponsor-stat-label">Proposed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sponsor-actions">
                        <div className="sponsor-view-toggle-group">
                            <button 
                                className={`sponsor-view-toggle ${viewMode === 'cards' ? 'sponsor-active' : ''}`}
                                onClick={() => setViewMode('cards')}
                            >
                                <FontAwesomeIcon icon={faThLarge} /> Cards
                            </button>
                            <button 
                                className={`sponsor-view-toggle ${viewMode === 'table' ? 'sponsor-active' : ''}`}
                                onClick={() => setViewMode('table')}
                            >
                                <FontAwesomeIcon icon={faTable} /> Table
                            </button>
                        </div>
                        <button 
                            onClick={() => navigate("/manage-sponsor")} 
                            className="sponsor-add-button"
                        >
                            <FontAwesomeIcon icon={faEdit} /> Manage
                        </button>
                    </div>
                </div>

                <div className="sponsor-controls">
                    <div className="sponsor-search-container">
                        <FontAwesomeIcon icon={faSearch} className="sponsor-search-icon" />
                        <input
                            type="text"
                            placeholder="Search projects by title, agency or contact..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="sponsor-search-input"
                        />
                    </div>
                </div>

                {selectedSponsor ? (
                    <div className="sponsor-budget-container">
                        <button
                            className="sponsor-close-budget"
                            onClick={() => setSelectedSponsor(null)}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <FinanceBudgetList srp_id={selectedSponsor} />
                    </div>
                ) : (
                    <>
                        {filteredSponsors.length > 0 ? (
                            viewMode === 'cards' ? (
                                <div className="sponsor-cards-grid">
                                    {filteredSponsors.map((sponsor) => (
                                        <div key={sponsor._id} className="sponsor-card">
                                            <div className="sponsor-card-header">
                                                <h3 className="sponsor-card-title">{sponsor.title}</h3>
                                                <span className={`sponsor-status ${sponsor.status.toLowerCase()}`}>
                                                    {sponsor.status}
                                                </span>
                                            </div>
                                            <div className="sponsor-card-body">
                                                <div className="sponsor-detail-row">
                                                    <div className="sponsor-detail-icon-wrapper">
                                                        <FontAwesomeIcon icon={faBuilding} className="sponsor-detail-icon" />
                                                    </div>
                                                    <div className="sponsor-detail-content">
                                                        <span className="sponsor-detail-label">Funding Agency</span>
                                                        <span className="sponsor-detail-value">{sponsor.agency}</span>
                                                    </div>
                                                </div>
                                                {sponsor.contact_person && (
                                                    <div className="sponsor-detail-row">
                                                        <div className="sponsor-detail-icon-wrapper">
                                                            <FontAwesomeIcon icon={faUserTie} className="sponsor-detail-icon" />
                                                        </div>
                                                        <div className="sponsor-detail-content">
                                                            <span className="sponsor-detail-label">Contact Person</span>
                                                            <span className="sponsor-detail-value">{sponsor.contact_person}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="sponsor-detail-row">
                                                    <div className="sponsor-detail-icon-wrapper">
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="sponsor-detail-icon" />
                                                    </div>
                                                    <div className="sponsor-detail-content">
                                                        <span className="sponsor-detail-label">Project Duration</span>
                                                        <span className="sponsor-detail-value">
                                                            {formatDate(sponsor.start_date)} - {sponsor.duration}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="sponsor-detail-row">
                                                    <div className="sponsor-detail-icon-wrapper">
                                                        <FontAwesomeIcon icon={faDollarSign} className="sponsor-detail-icon" />
                                                    </div>
                                                    <div className="sponsor-detail-content">
                                                        <span className="sponsor-detail-label">Total Budget</span>
                                                        <span 
                                                            className="sponsor-detail-value sponsor-clickable"
                                                            onClick={() => setSelectedSponsor(sponsor._id)}
                                                        >
                                                            {formatCurrency(parseFloat(sponsor.budget.$numberDecimal))}
                                                        </span>
                                                    </div>
                                                </div>
                                                {sponsor.cfp_url && (
                                                    <div className="sponsor-detail-row">
                                                        <div className="sponsor-detail-icon-wrapper">
                                                            <FontAwesomeIcon icon={faLink} className="sponsor-detail-icon" />
                                                        </div>
                                                        <div className="sponsor-detail-content">
                                                            <span className="sponsor-detail-label">CFP Document</span>
                                                            <a 
                                                                href={sponsor.cfp_url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="sponsor-detail-value sponsor-link"
                                                            >
                                                                View CFP
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="sponsor-table-container">
                                    <table className="sponsor-table">
                                        <thead>
                                            <tr>
                                                <th>Project Title</th>
                                                <th>Agency</th>
                                                <th>Status</th>
                                                <th>Start Date</th>
                                                <th>Duration</th>
                                                <th>Budget</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSponsors.map((sponsor) => (
                                                <tr key={sponsor._id} className="sponsor-table-row">
                                                    <td className="sponsor-table-title">{sponsor.title}</td>
                                                    <td>{sponsor.agency}</td>
                                                    <td>
                                                        <span className={`sponsor-status-badge ${sponsor.status.toLowerCase()}`}>
                                                            {sponsor.status}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(sponsor.start_date)}</td>
                                                    <td>{sponsor.duration}</td>
                                                    <td 
                                                        className="sponsor-clickable"
                                                        onClick={() => setSelectedSponsor(sponsor._id)}
                                                    >
                                                        {formatCurrency(parseFloat(sponsor.budget.$numberDecimal))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        ) : (
                            <div className="sponsor-no-results">
                                <div className="sponsor-no-results-content">
                                    <FontAwesomeIcon icon={faHandshake} className="sponsor-no-results-icon" />
                                    <h3>No sponsored projects found</h3>
                                    <p>Try adjusting your search or add a new project</p>
                                    <button 
                                        className="sponsor-add-project-btn"
                                        onClick={() => navigate("/manage-sponsor")}
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> Add Project
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DisplaySponsors;