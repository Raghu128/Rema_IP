import React, { useState } from "react";
import AddOrEditProjectForm from "../components/AddProjectForm";
import AddSponsorProjectForm from "../components/AddSponsorshipForm";
import AddSupervisorForm from "../components/AddSupervisorForm";

const FacultyProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectSaved = (project) => {
    console.log("Project saved:", project);
    setSelectedProject(null); // Clear selection after saving
    // Reload project list (if applicable)
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
  };

  const handleCancel = () => {
    setSelectedProject(null);
  };

  return (
    <div>
      <h1>Faculty Projects</h1>
        {/* <AddOrEditProjectForm
          selectedProject={selectedProject}
          onProjectSaved={handleProjectSaved}
          onCancel={handleCancel}
        /> */}
        {/* <AddSponsorProjectForm/> */}
        <AddSupervisorForm/>
      
    </div>
  );
};

export default FacultyProjects;
