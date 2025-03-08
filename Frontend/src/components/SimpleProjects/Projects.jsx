import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MinutesOfMeeting from "../MinutesOfMeeting/MinutesOfMeeting";
import "../../styles/SimpleProject/Projects.css";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faChevronDown, faChevronUp, faStickyNote, faTimes, faCode, faSitemap, faUserTie, faUsers, faMapMarkerAlt, faCalendarPlus, faCalendarCheck, faCalendarDay, faCalendarAlt, faFileAlt, faLink, faFlagCheckered } from '@fortawesome/free-solid-svg-icons'; // Updated icons

const Projects = ({ id }) => {
    const [projectData, setProjectData] = useState(null);
    const [filteredProjects, setFilteredProjects] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedProject, setExpandedProject,  ] = useState(null);
    const [showNotes, setShowNotes] = useState(null);
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
                <button className="projects-edit-button" onClick={() => navigate('/update-project')}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
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

            <div className="projects-grid">
                {filteredProjects && filteredProjects.length > 0 ? (
                    filteredProjects.map((project, index) => (
                        <div key={project._id} className={`project-card ${expandedProject === index ? 'expanded' : ''}`}>
                            <div className="project-card-header">
                                <h2 className="project-card-title">{project.name}</h2>
                            </div>

                            <div className="project-card-body">
                                <div className="project-card-meta">
                                    <p><FontAwesomeIcon icon={faCode} /> {project.domain}</p>
                                    <p><FontAwesomeIcon icon={faSitemap} /> {project.sub_domain}</p>
                                    <p><FontAwesomeIcon icon={faUserTie} /> {project.lead_author?.name || "Unknown"}</p>
                                    <p><FontAwesomeIcon icon={faUsers} /> {project.team ? project.team.map(member => member.name).join(', ') : 'None'}</p>
                                </div>
                                {expandedProject === index && (
                                    <div className="project-card-details">
                                        <hr className="project-divider" />
                                        <p><FontAwesomeIcon icon={faFlagCheckered} /> {project.status}</p>
                                        <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {project.venue || "N/A"}</p>
                                        <p><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(project.creation_date).toLocaleDateString()}</p>
                                        <p><FontAwesomeIcon icon={faCalendarCheck} /> {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}</p>
                                        <p><FontAwesomeIcon icon={faCalendarDay} /> {project.date_of_submission ? new Date(project.date_of_submission).toLocaleDateString() : "N/A"}</p>
                                        <p><FontAwesomeIcon icon={faCalendarPlus} /> {project.next_deadline ? new Date(project.next_deadline).toLocaleDateString() : "N/A"}</p>
                                        <p><FontAwesomeIcon icon={faFileAlt} /> {project.remarks || "No remarks"}</p>
                                        {project.paper_url && (
                                            <p><FontAwesomeIcon icon={faLink} /> <a href={project.paper_url} target="_blank" rel="noopener noreferrer">View Paper</a></p>
                                        )}
                                        {project.submission_url && (
                                            <p><FontAwesomeIcon icon={faLink} /> <a href={project.submission_url} target="_blank" rel="noopener noreferrer">View Submission</a></p>
                                        )}
                                    </div>
                                )}
                            </div>


                            <footer className="project-card-actions">
                            <button className="project-card-notes-button" onClick={() => setShowNotes(showNotes === index ? null : index)}>
                                    <FontAwesomeIcon icon={faStickyNote} /> 
                                </button>
                                
                                <button className="project-card-toggle-button" onClick={() => setExpandedProject(expandedProject === index ? null : index)}>
                                    {expandedProject === index ? <><FontAwesomeIcon icon={faChevronUp} /> </> : <><FontAwesomeIcon icon={faChevronDown} /> </>}
                                </button>

                            </footer>
                        </div>
                    ))
                ) : (
                    <div className="no-data">No project data found.</div>
                )}
            </div>

            {/* Notes Modal (overlay) */}
            {filteredProjects && filteredProjects.map((project, index) => (
                showNotes === index && (
                    <div key={project._id} className="project-notes-overlay">
                        <div className="project-notes-content">
                            <button className="project-close-notes-button" onClick={() => setShowNotes(null)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <MinutesOfMeeting projectId={project._id} />
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};

export default Projects;