import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/SimpleProject/Projects.css";

const Projects = ({ id }) => {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [teamMembers, setTeamMembers] = useState({});
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(null); // State to manage visibility of the dropdown menu

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
              teamMembersMap,
            };
          })
        );

        setProjectData(updatedProjects);
        setLoading(false);
      } catch (err) {
        setError("Error fetching project data from backend");
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index); // Toggle visibility based on the index
  };

  const handleEdit = (projectId) => {
    navigate("/update-project")
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <div className="project-container">
      <h1>Projects </h1>
      <button className="project-edit-button" onClick={() => navigate('/update-project')}>Edit</button>

      <div className="project-details-container">
        {projectData && projectData.length > 0 ? (
          projectData.map((project, index) => (
            <div key={index} className="project-item">
              <div className="project-header">
                <h2 className="project-title">Name: {project.name}</h2>
                
              </div>
              <p className="project-domain">{project.domain}</p>
              <h4 className="project-lead">Project Lead: {project.teamMembersMap[project.lead_author]}</h4>
              <h4 className="team-members-title">Team members:</h4>
              <ul className="team-members-list">
                {project.team && project.team.length > 0 ? (
                  project.team.map((teamMemberId, index) => (
                    <li key={index} className="team-member">
                      {index+1}. {project.teamMembersMap[teamMemberId]}
                    </li>
                  ))
                ) : (
                  <p>No team members found</p>
                )}
              </ul>

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
