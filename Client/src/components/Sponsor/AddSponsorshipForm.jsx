import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../styles/Sponsor/AddSponsorProjectForm.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faPlus, faEdit, faTrash, faSearch,
    faBuilding, faFileAlt, faLink, faCalendarAlt,
    faClock, faMoneyBillWave, faComment, faUserTie
} from '@fortawesome/free-solid-svg-icons';
import Loader from '../Loader';

const AddSponsorProjectForm = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Initialize all state variables at the top
    const [formData, setFormData] = useState({
        faculty_id: user ? user.id : "",
        agency: "",
        title: "",
        cfp_url: "",
        status: "active",
        start_date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
        duration: "",
        budget: "",
        remarks: "",
    });
    const [sponsors, setSponsors] = useState([]);
    const [selectedSponsor, setSelectedSponsor] = useState(null);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.id) {
            const fetchSponsors = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
                    setSponsors(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching sponsors:", error);
                    setLoading(false);
                }
            };
            fetchSponsors();
        }
    }, [user?.id]);

    const handleSelectSponsor = (sponsor) => {
        setSelectedSponsor(sponsor);
        setFormData({
            faculty_id: sponsor.faculty_id || user?.id,
            agency: sponsor.agency || "",
            title: sponsor.title || "",
            cfp_url: sponsor.cfp_url || "",
            status: sponsor.status || "active",
            start_date: sponsor.start_date ? new Date(sponsor.start_date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            duration: sponsor.duration || "",
            budget: sponsor.budget?.$numberDecimal ? parseFloat(sponsor.budget.$numberDecimal) : "",
            remarks: sponsor.remarks || "",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.faculty_id) {
            setMessage("Faculty ID is required.");
            return;
        }

        const requestData = {
            ...formData,
            budget: formData.budget ? formData.budget.toString() : "0",
        };

        try {
            setLoading(true);
            if (selectedSponsor) {
                await axios.put(`/api/v1/sponsor-projects/${selectedSponsor._id}`, requestData);
                setMessage("Sponsorship Project updated successfully!");
            } else {
                await axios.post("/api/v1/sponsor-projects", requestData);
                setMessage("Sponsorship Project created successfully!");
            }

            const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
            setSponsors(response.data);
            resetForm();
            setLoading(false);
        } catch (error) {
            console.error(error);
            setMessage("Failed to save sponsorship project");
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedSponsor) return;

        try {
            setLoading(true);
            await axios.delete(`/api/v1/sponsor-projects/${selectedSponsor._id}`);
            setMessage("Sponsorship Project deleted successfully!");

            const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
            setSponsors(response.data);
            resetForm();
            setLoading(false);
        } catch (error) {
            console.error(error);
            setMessage("Failed to delete sponsorship project");
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedSponsor(null);
        setFormData({
            faculty_id: user ? user.id : "",
            agency: "",
            title: "",
            cfp_url: "",
            status: "active",
            start_date: new Date().toISOString().split("T")[0], // Today's date
            duration: "",
            budget: "",
            remarks: "",
        });
    };

    const filteredSponsors = sponsors.filter((sponsor) =>
        sponsor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.agency.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <Loader />;
    return (
        <div className="sponsor-form-container">
            <div className="sponsor-form-header">
                <button onClick={() => navigate(-1)} className="sponsor-form-back-btn">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </button>
                <div className="header-content">
                    <h2 className="sponsor-form-title">
                        <FontAwesomeIcon icon={faUserTie} className="title-icon" />
                        {selectedSponsor ? "Edit Sponsorship Project" : "Create New Sponsorship Project"}
                    </h2>
                    {message && (
                        <div className={`sponsor-form-message ${message.includes("success") ? "success" : "error"}`}>
                            {message}
                            <button onClick={() => setMessage("")} className="message-close">
                                &times;
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="sponsor-form-layout">
                {/* Existing Projects Panel */}
                <div className="sponsor-form-projects-panel">
                    <div className="panel-card">
                        <div className="projects-panel-header">
                            <h3 className="panel-title">
                                <FontAwesomeIcon icon={faFileAlt} /> Your Projects
                            </h3>
                            <div className="projects-search-container">
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <FontAwesomeIcon icon={faSearch} className="projects-search-icon" />
                            </div>
                        </div>

                        <div className="projects-list-container">
                            {filteredSponsors.length > 0 ? (
                                <ul className="projects-list">
                                    {filteredSponsors.map((sponsor) => (
                                        <li
                                            key={sponsor._id}
                                            onClick={() => handleSelectSponsor(sponsor)}
                                            className={`project-item ${selectedSponsor?._id === sponsor._id ? "active" : ""}`}
                                        >
                                            <div className="project-header">
                                                <h4 className="project-title">{sponsor.title}</h4>
                                                <span className={`status-badge ${sponsor.status}`}>
                                                    {sponsor.status}
                                                </span>
                                            </div>
                                            <div className="project-agency">
                                                <FontAwesomeIcon icon={faBuilding} /> {sponsor.agency}
                                            </div>
                                            {sponsor.start_date && (
                                                <div className="project-date">
                                                    <FontAwesomeIcon icon={faCalendarAlt} /> {new Date(sponsor.start_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="projects-empty-state">
                                    <div className="empty-icon">
                                        <FontAwesomeIcon icon={faFileAlt} size="2x" />
                                    </div>
                                    <p>No projects found</p>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="clear-search-btn"
                                        >
                                            Clear search
                                        </button>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="sponsor-form-panel">
                    <div className="form-card">
                        <form onSubmit={handleSubmit}>
                            {/* Project Details Section */}
                            <div className="form-section">
                                <div className="section-header">
                                    <FontAwesomeIcon icon={faBuilding} className="section-icon" />
                                    <h3 className="section-title">Project Details</h3>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>
                                            <FontAwesomeIcon icon={faBuilding} /> Agency Name
                                        </label>
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                name="agency"
                                                value={formData.agency}
                                                onChange={handleChange}
                                                required
                                                placeholder="e.g., DST, AICTE, etc."
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <FontAwesomeIcon icon={faFileAlt} /> Project Title
                                        </label>
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                                placeholder="Project title"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <FontAwesomeIcon icon={faLink} /> CFP URL
                                        </label>
                                        <div className="input-container">
                                            <input
                                                type="url"
                                                name="cfp_url"
                                                value={formData.cfp_url}
                                                onChange={handleChange}
                                                placeholder="https://example.com/cfp"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <FontAwesomeIcon icon={faFileAlt} /> Status
                                        </label>
                                        <div className="input-container">
                                            <select name="status" value={formData.status} onChange={handleChange} required>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="completed">Completed</option>
                                                <option value="proposed">Proposed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Section */}
                            <div className="form-section">
                                <div className="section-header">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="section-icon" />
                                    <h3 className="section-title">Timeline</h3>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>
                                            <FontAwesomeIcon icon={faCalendarAlt} /> Start Date
                                        </label>
                                        <div className="input-container">
                                            <input
                                                type="date"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleChange}
                                                required
                                                max={new Date().toISOString().split("T")[0]} // Prevent future dates
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <FontAwesomeIcon icon={faClock} /> Duration (months)
                                        </label>
                                        <div className="input-container">
                                            <input
                                                type="number"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleChange}
                                                required
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Details Section */}
                            <div className="form-section">
                                <div className="section-header">
                                    <FontAwesomeIcon icon={faMoneyBillWave} className="section-icon" />
                                    <h3 className="section-title">Financial Details</h3>
                                </div>
                                <div className="form-group">
                                    <label>
                                        <FontAwesomeIcon icon={faMoneyBillWave} /> Budget (₹)
                                    </label>
                                    <div className="input-container with-prefix">
                                        <span className="input-prefix">₹</span>
                                        <input
                                            type="number"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information Section */}
                            <div className="form-section">
                                <div className="section-header">
                                    <FontAwesomeIcon icon={faComment} className="section-icon" />
                                    <h3 className="section-title">Additional Information</h3>
                                </div>
                                <div className="form-group">
                                    <label>Remarks</label>
                                    <div className="input-container">
                                        <textarea
                                            name="remarks"
                                            value={formData.remarks}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="Any additional notes about the project..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="form-actions">
                                {selectedSponsor && (
                                    <button
                                        type="button"
                                        className="delete-btn"
                                        onClick={handleDelete}
                                    >
                                        <FontAwesomeIcon icon={faTrash} /> Delete Project
                                    </button>
                                )}
                                <button type="submit" className="submit-btn">
                                    {selectedSponsor ? (
                                        <><FontAwesomeIcon icon={faEdit} /> Update Project</>
                                    ) : (
                                        <><FontAwesomeIcon icon={faPlus} /> Create Project</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSponsorProjectForm;