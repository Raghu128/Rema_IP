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
  faFileAlt, faLink, faFlagCheckered, faTable, faThLarge,
  faPlus, faChartLine, faTasks
} from '@fortawesome/free-solid-svg-icons';

const Projects = ({ id }) => {
    const [projectData, setProjectData] = useState(null);
    const [filteredProjects, setFilteredProjects] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [expandedProject, setExpandedProject] = useState(null);
    const [showNotes, setShowNotes] = useState(null);
    const [viewMode, setViewMode] = useState('table');
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        completed: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/v1/projects/${id}`);
                setProjectData(response.data);
                setFilteredProjects(response.data);
                
                // Calculate project statistics
                const total = response.data.length;
                const active = response.data.filter(p => p.status === 'ongoing').length;
                const completed = response.data.filter(p => p.status === 'completed').length;
                setStats({ total, active, completed });
                
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
            let filtered = [...projectData];
            
            // Apply search filter
            if (searchQuery) {
                filtered = filtered.filter((project) =>
                    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (project.domain && project.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (project.lead_author?.name && project.lead_author.name.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            }
            
            // Apply status filter
            if (statusFilter !== "All Status") {
                filtered = filtered.filter((project) => 
                    statusFilter === "Active" ? project.status === "ongoing" : project.status === "completed"
                );
            }
            
            setFilteredProjects(filtered);
        }
    }, [searchQuery, statusFilter, projectData]);

    if (loading) return <Loader />;
    if (error) return <div className="projects-error-message">{error}</div>;

    return (
        <div className="projects-container">
            <header className="projects-header">
                <div className="projects-header-left">
                    <h1 className="projects-title">
                        <FontAwesomeIcon icon={faTasks} className="projects-title-icon" /> 
                        My Projects
                    </h1>
                    <div className="projects-stats">
                        <div className="projects-stat-card">
                            <FontAwesomeIcon icon={faChartLine} className="projects-stat-icon projects-total" />
                            <div>
                                <span className="projects-stat-number">{stats.total}</span>
                                <span className="projects-stat-label">Total Projects</span>
                            </div>
                        </div>
                        <div className="projects-stat-card">
                            <FontAwesomeIcon icon={faChartLine} className="projects-stat-icon projects-active" />
                            <div>
                                <span className="projects-stat-number">{stats.active}</span>
                                <span className="projects-stat-label">Active</span>
                            </div>
                        </div>
                        <div className="projects-stat-card">
                            <FontAwesomeIcon icon={faChartLine} className="projects-stat-icon projects-completed" />
                            <div>
                                <span className="projects-stat-number">{stats.completed}</span>
                                <span className="projects-stat-label">Completed</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="projects-actions">
                    <div className="projects-view-toggle-group">
                        <button 
                            className={`projects-view-toggle-button ${viewMode === 'cards' ? 'projects-active' : ''}`}
                            onClick={() => setViewMode('cards')}
                        >
                            <FontAwesomeIcon icon={faThLarge} /> Cards
                        </button>
                        <button 
                            className={`projects-view-toggle-button ${viewMode === 'table' ? 'projects-active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            <FontAwesomeIcon icon={faTable} /> Table
                        </button>
                    </div>
                    <button 
                        className="projects-edit-button" 
                        onClick={() => navigate('/update-project')}
                    >
                        <FontAwesomeIcon icon={faEdit} /> Manage
                    </button>
                </div>
            </header>

            <div className="projects-search-container">
                <div className="projects-search">
                    <FontAwesomeIcon icon={faSearch} className="projects-search-icon" />
                    <input
                        type="text"
                        placeholder="Search projects by name, domain, or lead..."
                        className="projects-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="projects-filter">
                    <select 
                        className="projects-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All Status">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {viewMode === 'cards' ? (
                <div className="projects-grid">
                    {filteredProjects && filteredProjects.length > 0 ? (
                        filteredProjects.map((project, index) => (
                            <div key={project._id} className={`projects-card ${expandedProject === index ? 'projects-expanded' : ''}`}>
                                <div className="projects-card-header">
                                    <div className="projects-card-badge">
                                        <span className={`projects-status ${project.status.toLowerCase()}`}>
                                            {project.status}
                                        </span>
                                        {project.priority && (
                                            <span className="projects-priority">
                                                Priority: {project.priority}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="projects-card-title">{project.name}</h2>
                                    <p className="projects-card-subtitle">
                                        <FontAwesomeIcon icon={faUserTie} /> {project.lead_author?.name || "Unknown"}
                                    </p>
                                </div>

                                <div className="projects-card-body">
                                    <div className="projects-card-meta">
                                        <div className="projects-meta-item">
                                            <FontAwesomeIcon icon={faCode} />
                                            <span>{project.domain}</span>
                                        </div>
                                        <div className="projects-meta-item">
                                            <FontAwesomeIcon icon={faSitemap} />
                                            <span>{project.sub_domain}</span>
                                        </div>
                                        <div className="projects-meta-item">
                                            <FontAwesomeIcon icon={faUsers} />
                                            <span>{project.team?.length || 0} members</span>
                                        </div>
                                    </div>
                                    {expandedProject === index && (
                                        <div className="projects-card-details">
                                            <div className="projects-details-section">
                                                <h4>Project Timeline</h4>
                                                <div className="projects-timeline">
                                                    <div className="projects-timeline-item">
                                                        <span>Start Date</span>
                                                        <span>{new Date(project.creation_date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="projects-timeline-item">
                                                        <span>Next Deadline</span>
                                                        <span>{project.next_deadline ? new Date(project.next_deadline).toLocaleDateString() : "N/A"}</span>
                                                    </div>
                                                    <div className="projects-timeline-item">
                                                        <span>End Date</span>
                                                        <span>{project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="projects-details-section">
                                                <h4>Resources</h4>
                                                <div className="projects-links">
                                                    {project.paper_url && (
                                                        <a href={project.paper_url} target="_blank" rel="noopener noreferrer" className="projects-link">
                                                            <FontAwesomeIcon icon={faLink} /> Research Paper
                                                        </a>
                                                    )}
                                                    {project.submission_url && (
                                                        <a href={project.submission_url} target="_blank" rel="noopener noreferrer" className="projects-link">
                                                            <FontAwesomeIcon icon={faLink} /> Submission
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            {project.remarks && (
                                                <div className="projects-details-section">
                                                    <h4>Notes</h4>
                                                    <div className="projects-remarks">
                                                        <p>{project.remarks}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <footer className="projects-card-actions">
                                    <button 
                                        className="projects-card-notes-button" 
                                        onClick={() => setShowNotes(showNotes === index ? null : index)}
                                        aria-label="View notes"
                                    >
                                        <FontAwesomeIcon icon={faStickyNote} /> Minutes
                                    </button>
                                    <div className="projects-action-buttons">
                                        <button className="projects-quick-action">
                                            <FontAwesomeIcon icon={faCalendarPlus} /> Schedule
                                        </button>
                                        <button 
                                            className="projects-card-toggle-button" 
                                            onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                                            aria-label={expandedProject === index ? "Collapse details" : "Expand details"}
                                        >
                                            {expandedProject === index ? (
                                                <FontAwesomeIcon icon={faChevronUp} /> 
                                            ) : (
                                                <FontAwesomeIcon icon={faChevronDown} /> 
                                            )}
                                            Details
                                        </button>
                                    </div>
                                </footer>
                            </div>
                        ))
                    ) : (
                        <div className="projects-no-projects">
                            <div className="projects-no-projects-content">
                                <h3>No projects found</h3>
                                <p>Try adjusting your search or create a new project</p>
                                <button 
                                    className="projects-create-project-button"
                                    onClick={() => navigate('/update-project')}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Create Project
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="projects-table-container">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Domain</th>
                                <th>Status</th>
                                <th>Lead</th>
                                <th>Team</th>
                                <th>Timeline</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects && filteredProjects.length > 0 ? (
                                filteredProjects.map((project, index) => (
                                    <React.Fragment key={project._id}>
                                        <tr className="projects-table-row">
                                            <td>
                                                <div className="projects-name-cell">
                                                    <div className="projects-name">{project.name}</div>
                                                    {project.priority && (
                                                        <span className="projects-priority-badge">
                                                            {project.priority}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="projects-domain-cell">
                                                    <span className="projects-domain">{project.domain}</span>
                                                    {project.sub_domain && (
                                                        <span className="projects-sub-domain">{project.sub_domain}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`projects-status-badge ${project.status.toLowerCase()}`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="projects-lead-cell">
                                                    <FontAwesomeIcon icon={faUserTie} />
                                                    <span>{project.lead_author?.name || "Unknown"}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="projects-team-cell">
                                                    <FontAwesomeIcon icon={faUsers} />
                                                    <span>{project.team?.length || 0} members</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="projects-timeline-cell">
                                                    <div>
                                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                                        <span>{new Date(project.creation_date).toLocaleDateString()}</span>
                                                    </div>
                                                    {project.next_deadline && (
                                                        <div>
                                                            <FontAwesomeIcon icon={faCalendarPlus} />
                                                            <span>{new Date(project.next_deadline).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="projects-table-actions">
                                                    <button 
                                                        className="projects-table-notes-button"
                                                        onClick={() => setShowNotes(showNotes === index ? null : index)}
                                                    >
                                                        <FontAwesomeIcon icon={faStickyNote} />
                                                    </button>
                                                    <button 
                                                        className="projects-table-expand-button"
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
                                            <tr className="projects-table-details">
                                                <td colSpan="7">
                                                    <div className="projects-table-details-content">
                                                        <div className="projects-details-section">
                                                            <h4>Team Members</h4>
                                                            <div className="projects-team-members">
                                                                {project.team ? (
                                                                    project.team.map(member => (
                                                                        <span key={member._id} className="projects-team-member">
                                                                            {member.name}
                                                                        </span>
                                                                    ))
                                                                ) : 'None'}
                                                            </div>
                                                        </div>
                                                        <div className="projects-details-section">
                                                            <h4>Project Details</h4>
                                                            <div className="projects-details-grid">
                                                                <div>
                                                                    <p><strong>Venue:</strong> {project.venue || "N/A"}</p>
                                                                    <p><strong>Submission Date:</strong> {project.date_of_submission ? new Date(project.date_of_submission).toLocaleDateString() : "N/A"}</p>
                                                                </div>
                                                                <div>
                                                                    <p><strong>End Date:</strong> {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}</p>
                                                                    <p><strong>Remarks:</strong> {project.remarks || "None"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="projects-details-section">
                                                            <h4>Resources</h4>
                                                            <div className="projects-table-links">
                                                                {project.paper_url && (
                                                                    <a href={project.paper_url} target="_blank" rel="noopener noreferrer">
                                                                        <FontAwesomeIcon icon={faLink} /> Research Paper
                                                                    </a>
                                                                )}
                                                                {project.submission_url && (
                                                                    <a href={project.submission_url} target="_blank" rel="noopener noreferrer">
                                                                        <FontAwesomeIcon icon={faLink} /> Submission
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">
                                        <div className="projects-no-projects-table">
                                            <h3>No projects match your search</h3>
                                            <button 
                                                className="projects-create-project-button"
                                                onClick={() => navigate('/update-project')}
                                            >
                                                <FontAwesomeIcon icon={faPlus} /> Create New Project
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Notes Modal (overlay) */}
            {filteredProjects && filteredProjects.map((project, index) => (
                showNotes === index && (
                    <div key={project._id} className="projects-notes-overlay">
                        <div className="projects-notes-content">
                            <button 
                                className="projects-close-notes-button" 
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