import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/FacultyDashboard.css";
import { useSelector } from "react-redux";

import StudentProjects from "../components/SimpleProjects/StudentProject";
import StudentEquipmentList from "../components/Equipment/StudentEquipment";
import NotificationsList from "../components/Notification/NotificationsList";
import VenueListComponent from "../components/Venues/VenueListComponent";
import LandingPage from "../components/LandingPage";
import StudentLeaves from "../components/Leaves/StudentLeaves";

const StudentDashboard = () => {
  const [currElement, setElement] = useState("");
  const { user } = useSelector((state) => state.user);

  // Function to render the current component based on selected option
  const renderComponent = () => {
    if (!user?.id) return <p>Loading... Please wait.</p>;

    const componentMap = {
      Projects: <StudentProjects id={user.id} />,
      Venues: <VenueListComponent />,
      Notifications: <NotificationsList />,
      Equipment: <StudentEquipmentList />,
      Leaves : <StudentLeaves/>
    };

    return componentMap[currElement] || <LandingPage />;
  };


  return (
    <div className="faculty-dashboard-container">
      {/* Sidebar */}
      <div className="faculty-sidebar">
        <ul className="faculty-sidebar-list">
          {[
            "Projects",
            "Equipment",
            "Leaves"
          ].map((item) => (
            <li key={item}>
              <Link onClick={() => setElement(item)}>{item}</Link>
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
