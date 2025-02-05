import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/FacultyDashboard.css"; 
import Projects from "../components/SimpleProjects/Projects";
import Students from "../components/Supervisor/Students";
import UserEquipmentList from "../components/Equipment/UserEquipmentList";
import Notifications from "../components/NotificationAddForm";
import VenueListComponent from "../components/Venues/VenueListComponent";
import AddUserForm from "../components/UserForm";
import DisplaySponsors from "../components/Sponsor/DisplaySponsors";
import ExpensesList from "../components/Expenses/Allexpenses";
import FinanceBudgetAddForm from "../components/FinanceBudget/FinanceBudgetAddForm";
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
        return <VenueListComponent />;
      case "Sponsor":
        return <DisplaySponsors />;
      case "Notifications":
        return <Notifications />;
      case "Add-User":
        return <AddUserForm/>
      case "Equipment":
          return <UserEquipmentList/>
      case "Expenses":
        return <ExpensesList/>
      case "Budget":
        return <FinanceBudgetAddForm/>
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
          <li><Link onClick={() => setElement("Sponsor")}>Sponsor</Link></li>
          <li><Link onClick={() => setElement("Budget")}>Budget</Link></li>
          <li><Link onClick={() => setElement("Expenses")}>Expenses</Link></li>
          <li><Link onClick={() => setElement("Equipment")}>Equipment</Link></li>
          <li><Link onClick={() => setElement("Venues")}>Venues</Link></li>
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
