import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/FacultyDashboard.css";

import Projects from "../components/SimpleProjects/Projects";
import Students from "../components/Supervisor/Students";
import UserEquipmentList from "../components/Equipment/UserEquipmentList";
import NotificationsList from "../components/Notification/NotificationsList";
import VenueListComponent from "../components/Venues/VenueListComponent";
import AddUserForm from "../components/UserForm";
import DisplaySponsors from "../components/Sponsor/DisplaySponsors";
import ExpensesList from "../components/Expenses/Allexpenses";
import LandingPage from "../components/LandingPage";
import LeavesForFacultyPage from "../components/Leaves/AllLeaves";

const FacultyDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Get tab from URL params (default to "Projects" if not provided)
  const currElement = searchParams.get("tab");

  // Function to render the current component based on selected tab
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
      Leaves: <LeavesForFacultyPage />,
    };

    return componentMap[currElement] || <LandingPage />;
  };

  // Function to handle navigation and update URL params
  const handleNavigation = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="faculty-dashboard-container">
      {/* Sidebar */}
      <div className="faculty-sidebar">
        <ul className="faculty-sidebar-list">
          {["Projects", "Students", "Sponsor", "Expenses", "Equipment", "Leaves"].map((item) => (
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

export default FacultyDashboard;
