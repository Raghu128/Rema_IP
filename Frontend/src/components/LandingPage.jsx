import React from "react";
import { useSelector } from "react-redux";
import NotificationsList from "./Notification/NotificationsList";
import VenueListComponent from "./Venues/VenueListComponent";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="landingpage-dashboard">
      

      <div className="landingpage-content">
        <div className="landingpage-notification">
          <NotificationsList />
        </div>

        <div className="landingpage-venue">
          <h2>📍 Venues</h2>
          <VenueListComponent />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
