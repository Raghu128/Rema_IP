import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MinutesOfMeeting from "../MinutesOfMeeting/MinutesOfMeeting";
import "../../styles/SimpleProject/Projects.css";

const Projects = ({ id }) => {
  const [projectData, setProjectData] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProject, setExpandedProject] = useState(null);
  const [showNotes, setShowNotes] = useState(null); // Track which project’s notes are open
  const navigate = useNavigate();

  const getUserName = async (userId) => {
    try {
      const response = await axios.get(`/api/v1/userbyid/${userId}`);
      return response.data[0].name;
    } catch (err) {
      console.error("Error fetching user name", err);
      return "Unknown User";
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/projects/${id}`);
        const projects = response.data;

        const updatedProjects = await Promise.all(
          projects.map(async (project) => {
            const facultyName = await getUserName(project.faculty_id);
            const leadAuthorName = await getUserName(project.lead_author);
            
            const updatedTeamMembers = await Promise.all(
              project.team.map(async (teamMemberId) => {
                const name = await getUserName(teamMemberId);
                return { id: teamMemberId, name };
              })
            );

            const teamMembersMap = updatedTeamMembers.reduce((acc, member) => {
              acc[member.id] = member.name;
              return acc;
            }, {});

            return {
              ...project,
              facultyName,
              leadAuthorName,
              teamMembersMap,
            };
          })
        );

        setProjectData(updatedProjects);
        setFilteredProjects(updatedProjects);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="project-container">
      <h1>Projects</h1>
      <button className="project-edit-button" onClick={() => navigate('/update-project')}>Edit</button>
      
      <input
        type="text"
        placeholder="Search project ..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="project-details-container">
        {filteredProjects && filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div key={index} className="project-item">
              <div className="project-header">
                <h2 className="project-title">{project.name}</h2>
              </div>
              
              <p><strong>Domain:</strong> {project.domain}</p>
              <p><strong>Sub-Domain:</strong> {project.sub_domain}</p>
              <p><strong>Project Lead:</strong> {project.leadAuthorName}</p>
              <h4>Team members:</h4>
              <ul className="team-members-list">
                {project.team && project.team.length > 0 ? (
                  project.team.map((teamMemberId, index) => (
                    <li key={index} className="team-member">
                      {index + 1}. {project.teamMembersMap[teamMemberId]}
                    </li>
                  ))
                ) : (
                  <p>No team members found</p>
                )}
              </ul>
              
              {expandedProject === index && (
                <div className="full-project-info">
                  <p><strong>Status:</strong> {project.status}</p>
                  <p><strong>Venue:</strong> {project.venue || "N/A"}</p>
                  <p><strong>Created on:</strong> {new Date(project.creation_date).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}</p>
                  <p><strong>Date of Submission:</strong> {project.date_of_submission ? new Date(project.date_of_submission).toLocaleDateString() : "N/A"}</p>
                  <p><strong>Next Deadline:</strong> {project.next_deadline ? new Date(project.next_deadline).toLocaleDateString() : "N/A"}</p>
                  <p><strong>Remarks:</strong> {project.remarks || "No remarks"}</p>
                  <p>
                    📄 <strong>Paper:</strong> <a href={project.paper_url} target="_blank" rel="noopener noreferrer">View Paper</a>
                  </p>
                  <p>
                    📩 <strong>Submission:</strong> <a href={project.submission_url} target="_blank" rel="noopener noreferrer">View Submission</a>
                  </p>
                </div>
              )}
              
              <div className="project-actions">
                <span 
                  className="project-toggle-button" 
                  onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                >
                  {expandedProject === index ? "less" : "more"}
                </span>

                <span 
                  className="project-notes-button" 
                  onClick={() => setShowNotes(showNotes === index ? null : index)}
                >
                  Notes
                </span>
              </div>

              {showNotes === index && (
                <div className="project-notes-overlay">
                  <div className="project-notes-content">
                    <button className="project-close-notes-button" onClick={() => setShowNotes(null)}>✖</button>
                    <MinutesOfMeeting projectId={project._id} />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No project data found</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
