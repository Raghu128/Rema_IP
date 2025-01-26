import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/FacultyDashboard.css"; 
import Projects from "../components/SimpleProjects/Projects";
import Students from "../components/Students";
import Venues from "../components/Venues";
import Reports from "../components/Reports";
import Notifications from "../components/NotificationAddForm";
import { useSelector } from "react-redux";

const FacultyDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currElement, setElement] = useState("");
  const { user } = useSelector((state) => state.user);
  


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to render the current component based on currElement
  const renderComponent = () => {
    switch (currElement) {
      case "Projects":
        return <Projects id={user.id} />;
      case "Students":
        return <Students />;
      case "Venues":
        return <Venues />;
      case "Reports":
        return <Reports />;
      case "Notifications":
        return <Notifications />;
      default:
        return <p>Select an option from the sidebar</p>; // Default message when no option is selected
    }
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? "<<" : ">>"}
        </button>
        {isSidebarOpen && (
          <ul className="sidebar-list">
            <li><Link onClick={() => setElement("Projects")}>Projects</Link></li>
            <li><Link onClick={() => setElement("Students")}>Students</Link></li>
            <li><Link onClick={() => setElement("Venues")}>Venues</Link></li>
            <li><Link onClick={() => setElement("Reports")}>Reports</Link></li>
            <li><Link onClick={() => setElement("Notifications")}>Notifications</Link></li>
            <li><Link onClick={() => setElement("Settings")}>Settings</Link></li>
          </ul>
        )}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {renderComponent()}
      </div>
    </div>
  );
};

export default FacultyDashboard;
