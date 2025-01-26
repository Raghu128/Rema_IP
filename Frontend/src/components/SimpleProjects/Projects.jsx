import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/SimpleProject/Projects.css";

const Projects = ({ id }) => {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamMembers, setTeamMembers] = useState({});
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
    console.log("Edit project", projectId);
    // Implement your edit logic here
  };

  const handleAdd = (projectId) => {
    console.log("Add new member to project", projectId);
    // Implement your add logic here
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h1>Projects :</h1>
      <div className="project-details-container">
        {projectData && projectData.length > 0 ? (
          projectData.map((project, index) => (
            <div key={index} className="project-item">
              <div className="project-header">
                <h2 className="project-title">Name: {project.name}</h2>
                <div className="ellipsis-menu" onClick={() => toggleDropdown(index)}>
                  &#8230; 
                </div>
                {dropdownVisible === index && (
                  <div className="dropdown-options">
                    <button onClick={() => handleEdit(project.id)}>Edit</button>
                    <button onClick={() => handleAdd(project.id)}>Add</button>
                  </div>
                )}
              </div>
              <p className="project-domain">{project.domain}</p>
              <h4 className="project-lead">Project Lead: {project.teamMembersMap[project.lead_author]}</h4>
              <h4 className="team-members-title">Team members:</h4>
              <ul className="team-members-list">
                {project.team && project.team.length > 0 ? (
                  project.team.map((teamMemberId, index) => (
                    <li key={index} className="team-member">
                      {index}. {project.teamMembersMap[teamMemberId]}
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
    </>
  );
};

export default Projects;
