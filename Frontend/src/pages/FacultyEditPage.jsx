import React, { useState } from "react";
import AddOrEditProjectForm from "../components/AddProjectForm";
import AddSponsorProjectForm from "../components/AddSponsorshipForm";
import AddSupervisorForm from "../components/Students/AddSupervisorForm";
import EquipmentAddForm from "../components/EquipmentAddForm";
import FinanceBudgetAddForm from "../components/FinanceBudgetAddForm";
import VenueAddForm from "../components/VenueAddForm";


const FacultyProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectSaved = (project) => {
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
      <h1>Faculty DashBoard</h1>
        {/* <AddOrEditProjectForm
          selectedProject={selectedProject}
          onProjectSaved={handleProjectSaved}
          onCancel={handleCancel}
        /> */}
        {/* <AddSponsorProjectForm/> */}
        {/* <AddSupervisorForm/> */}
        {/* <EquipmentAddForm/> */}
        {/* <FinanceBudgetAddForm/> */}
        {/* <VenueAddForm/> */}
      
    </div>
  );
};

export default FacultyProjects;
