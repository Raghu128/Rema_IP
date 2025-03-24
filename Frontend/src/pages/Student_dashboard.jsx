import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/FacultyDashboard.css";
import { useSelector } from "react-redux";

import StudentProjects from "../components/SimpleProjects/StudentProject";
import StudentEquipmentList from "../components/Equipment/StudentEquipment";
import NotificationsList from "../components/Notification/NotificationsList";
import VenueListComponent from "../components/Venues/VenueListComponent";
import LandingPage from "../components/LandingPage";
import StudentLeaves from "../components/Leaves/StudentLeaves";

const StudentDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.user);

  // Get the tab from URL parameters (default to "Projects" if not provided)
  const currElement = searchParams.get("tab");

  // Function to render the correct component based on the URL parameter
  const renderComponent = () => {
    if (!user?.id) return <p>Loading... Please wait.</p>;

    const componentMap = {
      Projects: <StudentProjects id={user.id} />,
      Venues: <VenueListComponent />,
      Notifications: <NotificationsList />,
      Equipment: <StudentEquipmentList />,
      Leaves: <StudentLeaves />,
    };

    return componentMap[currElement] || <LandingPage />;
  };

  // Function to update the URL when clicking a sidebar link
  const handleNavigation = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="faculty-dashboard-container">
      {/* Sidebar */}
      <div className="faculty-sidebar">
        <ul className="faculty-sidebar-list">
          {["Projects", "Equipment", "Leaves"].map((item) => (
            <li key={item}>
              <Link to={`?tab=${item}`} onClick={() => handleNavigation(item)}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="faculty-main-content">{renderComponent()}</div>
    </div>
  );
};

export default StudentDashboard;
