import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/FacultyDashboard.css";
import { useSelector } from "react-redux";

import Projects from "../components/SimpleProjects/Projects";
import Students from "../components/Supervisor/Students";
import UserEquipmentList from "../components/Equipment/UserEquipmentList";
import NotificationsList from "../components/Notification/NotificationsList";
import VenueListComponent from "../components/Venues/VenueListComponent";
import AddUserForm from "../components/UserForm";
import DisplaySponsors from "../components/Sponsor/DisplaySponsors";
import ExpensesList from "../components/Expenses/Allexpenses";
import LandingPage from "../components/LandingPage";

const FacultyDashboard = () => {
  const [currElement, setElement] = useState("");
  const { user } = useSelector((state) => state.user);

  // Function to render the current component based on selected option
  const renderComponent = () => {
    if (!user?.id) return <p>Loading... Please wait.</p>;

    const componentMap = {
      Projects: <Projects id={user.id} />,
      Students: <Students id={user.id} />,
      Venues: <VenueListComponent />,
      Sponsor: <DisplaySponsors />,
      Notifications: <NotificationsList />,
      "Add-User": <AddUserForm />,
      Equipment: <UserEquipmentList />,
      Expenses: <ExpensesList />,
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
            "Students",
            "Sponsor",
            "Expenses",
            "Equipment",
            "Add-User",
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

export default FacultyDashboard;
