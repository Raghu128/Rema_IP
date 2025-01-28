import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/FacultyDashboard.css"; 
import Projects from "../components/SimpleProjects/Projects";
import Students from "../components/Students/Students";
import Venues from "../components/Venues";
import Reports from "../components/Reports";
import Notifications from "../components/NotificationAddForm";
import AddUserForm from "../components/UserForm";
import { useSelector } from "react-redux";

const FacultyDashboard = () => {
  // Set "Projects" as the default value for currElement
  const [currElement, setElement] = useState("Projects");
  const { user } = useSelector((state) => state.user);

  // Function to render the current component based on currElement
  const renderComponent = () => {
    if (!user?.id) {
      return <p>Loading... Please wait.</p>; // Show a loading message if user.id is not available
    }
    switch (currElement) {
      case "Projects":
        return <Projects id={user.id} />;
      case "Students":
        return <Students id={user.id} />;
      case "Venues":
        return <Venues />;
      case "Reports":
        return <Reports />;
      case "Notifications":
        return <Notifications />;
      case "Add-User":
        return <AddUserForm/>
      default:
        return <p>Select an option from the sidebar</p>; // Default message when no option is selected
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul className="sidebar-list">
          <li className="default-active"><Link onClick={() => setElement("Projects")}>Projects</Link></li>
          <li><Link onClick={() => setElement("Students")}>Students</Link></li>
          <li><Link onClick={() => setElement("Venues")}>Venues</Link></li>
          <li><Link onClick={() => setElement("Reports")}>Reports</Link></li>
          <li><Link onClick={() => setElement("Notifications")}>Notifications</Link></li>
          <li><Link onClick={() => setElement("Add-User")}>Add User</Link></li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {renderComponent()}
      </div>
    </div>
  );
};

export default FacultyDashboard;
