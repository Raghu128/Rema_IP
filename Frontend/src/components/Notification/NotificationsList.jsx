import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/Notification/NotificationsList.css";
import { useNavigate } from "react-router-dom";

const NotificationsList = () => {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/v1/notifications/${user.id}`);
        const data = (await response.json()).notification;
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <div className="notification-container">
      <button className="add-btn" onClick={() => navigate("/manage-notification")}>
        ➕ Add Notification
      </button>

      {loading ? (
        <p className="notification-message">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="notification-message">No notifications available.</p>
      ) : (
        <div className="notification-grid">
          {notifications.map((notif) => (
            <div key={notif._id} className="notification-card">
              <h3>{notif.type || "General"}</h3>
              <p>📩 {notif.text}</p>
              <p>📅 {new Date(notif.creation_date).toLocaleDateString()}</p>
              <p>⏳ Due: {new Date(notif.due_date).toLocaleDateString()}</p>
              <span className={`priority ${notif.priority.toLowerCase()}`}>
                {notif.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
