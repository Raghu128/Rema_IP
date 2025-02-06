import React from "react";
import { useSelector } from "react-redux";
import NotificationsList from "./Notification/NotificationsList";
import VenueListComponent from "./Venues/VenueListComponent";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const { user } = useSelector((state) => state.user);
  

  return (
    <div className="landingpage-dashboard" >
      <h1>Welcome, {user?.email}</h1>
      <p>Faculty Dashboard - Manage your projects and finances</p>

        <div className="landingpage-element-container">
          <NotificationsList/>
          <VenueListComponent/>
        </div>
      
    </div>
  );
};

export default LandingPage;
