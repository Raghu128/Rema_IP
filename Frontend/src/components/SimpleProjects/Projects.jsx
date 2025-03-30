import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MinutesOfMeeting from "../MinutesOfMeeting/MinutesOfMeeting";
import "../../styles/SimpleProject/Projects.css";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, faSearch, faChevronDown, faChevronUp, 
  faStickyNote, faTimes, faCode, faSitemap, 
  faUserTie, faUsers, faMapMarkerAlt, faCalendarPlus, 
  faCalendarCheck, faCalendarDay, faCalendarAlt, 
  faFileAlt, faLink, faFlagCheckered, faTable, faThLarge
} from '@fortawesome/free-solid-svg-icons';

const Projects = ({ id }) => {
    const [projectData, setProjectData] = useState(null);
    const [filteredProjects, setFilteredProjects] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedProject, setExpandedProject] = useState(null);
    const [showNotes, setShowNotes] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'cards' or 'table'
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/v1/projects/${id}`);
                setProjectData(response.data);
                setFilteredProjects(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error fetching project data from backend");
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    useEffect(() => {
        if (projectData) {
            const filtered = projectData.filter((project) =>
                project.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProjects(filtered);
        }
    }, [searchQuery, projectData]);

    if (loading) return <Loader />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="projects-container">
            <header className="projects-header">
                <h1 className="projects-title">Projects</h1>
                <div className="projects-actions">
                    <button 
                        className={`view-toggle-button ${viewMode === 'cards' ? 'active' : ''}`}
                        onClick={() => setViewMode('cards')}
                    >
                        <FontAwesomeIcon icon={faThLarge} /> Cards
                    </button>
                    <button 
                        className={`view-toggle-button ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                    >
                        <FontAwesomeIcon icon={faTable} /> Table
                    </button>
                    <button className="projects-edit-button" onClick={() => navigate('/update-project')}>
                        <FontAwesomeIcon icon={faEdit} /> Manage
                    </button>
                </div>
            </header>

            <div className="projects-search">
                <FontAwesomeIcon icon={faSearch} className="projects-search-icon" />
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="projects-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {viewMode === 'cards' ? (
                <div className="projects-grid">
                    {filteredProjects && filteredProjects.length > 0 ? (
                        filteredProjects.map((project, index) => (
                            <div key={project._id} className={`project-card ${expandedProject === index ? 'expanded' : ''}`}>
                                <div className="project-card-header">
                                    <h2 className="project-card-title">{project.name}</h2>
                                    <span className={`project-status ${project.status.toLowerCase()}`}>
                                        {project.status}
                                    </span>
                                </div>

                                <div className="project-card-body">
                                    <div className="project-card-meta">
                                        <p><FontAwesomeIcon icon={faCode} /> <span className="meta-label">Domain:</span> {project.domain}</p>
                                        <p><FontAwesomeIcon icon={faSitemap} /> <span className="meta-label">Sub-domain:</span> {project.sub_domain}</p>
                                        <p><FontAwesomeIcon icon={faUserTie} /> <span className="meta-label">Lead:</span> {project.lead_author?.name || "Unknown"}</p>
                                    </div>
                                    {expandedProject === index && (
                                        <div className="project-card-details">
                                            <hr className="project-divider" />
                                            <div className="details-grid">
                                                <div>
                                                    <p><FontAwesomeIcon icon={faUsers} /> <span className="meta-label">Team:</span> {project.team ? project.team.map(member => member.name).join(', ') : 'None'}</p>
                                                    <p><FontAwesomeIcon icon={faMapMarkerAlt} /> <span className="meta-label">Venue:</span> {project.venue || "N/A"}</p>
                                                    <p><FontAwesomeIcon icon={faCalendarAlt} /> <span className="meta-label">Created:</span> {new Date(project.creation_date).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p><FontAwesomeIcon icon={faCalendarCheck} /> <span className="meta-label">End Date:</span> {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}</p>
                                                    <p><FontAwesomeIcon icon={faCalendarDay} /> <span className="meta-label">Submission:</span> {project.date_of_submission ? new Date(project.date_of_submission).toLocaleDateString() : "N/A"}</p>
                                                    <p><FontAwesomeIcon icon={faCalendarPlus} /> <span className="meta-label">Deadline:</span> {project.next_deadline ? new Date(project.next_deadline).toLocaleDateString() : "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="project-links">
                                                {project.paper_url && (
                                                    <a href={project.paper_url} target="_blank" rel="noopener noreferrer" className="project-link">
                                                        <FontAwesomeIcon icon={faLink} /> View Paper
                                                    </a>
                                                )}
                                                {project.submission_url && (
                                                    <a href={project.submission_url} target="_blank" rel="noopener noreferrer" className="project-link">
                                                        <FontAwesomeIcon icon={faLink} /> View Submission
                                                    </a>
                                                )}
                                            </div>
                                            {project.remarks && (
                                                <div className="project-remarks">
                                                    <FontAwesomeIcon icon={faFileAlt} />
                                                    <p>{project.remarks}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <footer className="project-card-actions">
                                    <button 
                                        className="project-card-notes-button" 
                                        onClick={() => setShowNotes(showNotes === index ? null : index)}
                                        aria-label="View notes"
                                    >
                                        <FontAwesomeIcon icon={faStickyNote} /> 
                                    </button>
                                    
                                    <button 
                                        className="project-card-toggle-button" 
                                        onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                                        aria-label={expandedProject === index ? "Collapse details" : "Expand details"}
                                    >
                                        {expandedProject === index ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                                    </button>
                                </footer>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No project data found.</div>
                    )}
                </div>
            ) : (
                <div className="projects-table-container">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Domain</th>
                                <th>Status</th>
                                <th>Lead</th>
                                <th>Created</th>
                                <th> Next Deadline</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects && filteredProjects.length > 0 ? (
                                filteredProjects.map((project, index) => (
                                    <React.Fragment key={project._id}>
                                        <tr className="project-table-row">
                                            <td>
                                                <div className="project-name-cell">
                                                    {project.name}
                                                    {project.team && project.team.length > 0 && (
                                                        <span className="team-count">{project.team.length} members</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="domain-cell">
                                                    <span className="domain">{project.domain}</span>
                                                    {project.sub_domain && (
                                                        <span className="sub-domain">{project.sub_domain}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${project.status.toLowerCase()}`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td>{project.lead_author?.name || "Unknown"}</td>
                                            <td>{new Date(project.creation_date).toLocaleDateString()}</td>
                                            <td>{project.next_deadline ? new Date(project.next_deadline).toLocaleDateString() : "N/A"}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <button 
                                                        className="table-notes-button"
                                                        onClick={() => setShowNotes(showNotes === index ? null : index)}
                                                    >
                                                        <FontAwesomeIcon icon={faStickyNote} />
                                                    </button>
                                                    <button 
                                                        className="table-expand-button"
                                                        onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                                                    >
                                                        {expandedProject === index ? (
                                                            <FontAwesomeIcon icon={faChevronUp} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faChevronDown} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedProject === index && (
                                            <tr className="project-table-details">
                                                <td colSpan="7">
                                                    <div className="table-details-content">
                                                        <div className="details-section">
                                                            <h4>Team Members</h4>
                                                            <p>{project.team ? project.team.map(member => member.name).join(', ') : 'None'}</p>
                                                        </div>
                                                        <div className="details-section">
                                                            <h4>Additional Information</h4>
                                                            <p><strong>Venue:</strong> {project.venue || "N/A"}</p>
                                                            <p><strong>Submission Date:</strong> {project.date_of_submission ? new Date(project.date_of_submission).toLocaleDateString() : "N/A"}</p>
                                                            <p><strong>End Date:</strong> {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}</p>
                                                        </div>
                                                        <div className="details-section">
                                                            <h4>Links</h4>
                                                            <div className="table-links">
                                                                {project.paper_url && (
                                                                    <a href={project.paper_url} target="_blank" rel="noopener noreferrer">
                                                                        <FontAwesomeIcon icon={faLink} /> Paper
                                                                    </a>
                                                                )}
                                                                {project.submission_url && (
                                                                    <a href={project.submission_url} target="_blank" rel="noopener noreferrer">
                                                                        <FontAwesomeIcon icon={faLink} /> Submission
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {project.remarks && (
                                                            <div className="details-section">
                                                                <h4>Remarks</h4>
                                                                <p>{project.remarks}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="no-data">No project data found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Notes Modal (overlay) */}
            {filteredProjects && filteredProjects.map((project, index) => (
                showNotes === index && (
                    <div key={project._id} className="project-notes-overlay">
                        <div className="project-notes-content">
                            <button 
                                className="project-close-notes-button" 
                                onClick={() => setShowNotes(null)}
                                aria-label="Close notes"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <h3>Meeting Minutes: {project.name}</h3>
                            <MinutesOfMeeting projectId={project._id} />
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};

export default Projects;