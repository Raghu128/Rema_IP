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

  // Function to get an icon for notification type
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "todo":
        return "📝"; // Notepad icon
      case "reminder":
        return "⏰"; // Alarm clock icon
      case "deadline":
        return "📅"; // Calendar icon
      default:
        return "📌"; // Default pin icon
    }
  };

  // Function to get an icon for priority
  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "🔴"; // Red circle for high priority
      case "medium":
        return "🟠"; // Orange circle for medium priority
      case "low":
        return "🟢"; // Green circle for low priority
      default:
        return "⚪"; // Default white circle
    }
  };

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
              {/* Tags for Notification Type and Priority */}
              <div className="notification-tags">
                <span className="type-icon">{getTypeIcon(notif.type)}</span>
                <span className="priority-icon">{getPriorityIcon(notif.priority)}</span>
              </div>

              {/* Notification Details */}
              <p className="notification-text">📩 {notif.text}</p>

              {/* Due Date */}
              <p className="notification-date">📅 Due: {new Date(notif.due_date).toLocaleDateString()}</p>

              {/* Added By */}
              <p className="notification-added-by">
                🏷️ Added by: {notif.added_by === user.id ? "Self" : notif.added_by_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
