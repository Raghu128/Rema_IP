import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FiBell, 
  FiTrash2, 
  FiClock, 
  FiAlertTriangle,
  FiFlag,
  FiAlertCircle,
  FiInfo
} from "react-icons/fi";
import {FaEdit} from "react-icons/fa";
import Loader from "../Loader";
import "../../styles/Notification/NotificationsList.css";
import { use } from "react";

const NotificationsList = () => {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/v1/notifications/${user.id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const notificationsData = data.notification || [];

        const updatedNotifications = notificationsData.map((notif) => {
          const addedByName =
            notif.added_by && typeof notif.added_by === "object"
              ? notif.added_by._id === user.id
                ? "You"
                : notif.added_by.name || "Unknown"
              : "System";
          return { ...notif, added_by_name: addedByName };
        });

        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const isExpired = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const deleteNotification = async (id, added_by) => {
    if (!id) return;

    if (
      added_by &&
      typeof added_by === "object" &&
      added_by._id !== user?.id
    ) {
      alert("You can only delete your own notifications");
      return;
    } else if (typeof added_by === "string" && added_by !== user?.id) {
      alert("You can only delete your own notifications");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/v1/notifications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete notification.");
      }
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError("Failed to delete notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch ((type || "").toLowerCase()) {
      case "todo":
        return <span>📝 Todo</span>;
      case "reminder":
        return <span>⏰ Reminder</span>;
      case "deadline":
        return <span>📅 Deadline</span>;
      default:
        return <span>📌 General</span>;
    }
  };

  const getPriorityIcon = (priority) => {
    switch ((priority || "").toLowerCase()) {
      case "high":
        return <FiAlertCircle className="priority-icon high" />;
      case "medium":
        return <FiFlag className="priority-icon medium" />;
      case "low":
        return <FiInfo className="priority-icon low" />;
      default:
        return <FiInfo className="priority-icon" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch ((priority || "").toLowerCase()) {
      case "high":
        return "#ffebee";
      case "medium":
        return "#fff8e1";
      case "low":
        return "#e8f5e9";
      default:
        return "#ffffff";
    }
  };

  if (loading) {
    return <Loader />;
  }
  


  return (
    <div className="notifications-dashboard">
      <div className="notifications-header">
        <div className="header-title">
          <FiBell className="header-icon" />
          <h1>Notifications</h1>
          <span className="badge">{notifications.length}</span>
        </div>
        <button 
          className="add-button"
          onClick={() => navigate("/manage-notification")}
        >
          <FaEdit /> Manage
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <FiAlertTriangle /> {error}
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <FiBell />
          </div>
          <h3>No notifications yet</h3>
          <p>Create your first notification to get started</p>
          
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="notifications-table-container">
          <table className="notifications-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Message</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notif) => {
                const expired = isExpired(notif.due_date);
                const priority = notif.priority || "";
                
                return (
                  <tr 
                    key={notif._id} 
                    className={`notification-row ${expired ? 'expired' : ''}`}
                    style={{ 
                      backgroundColor: expired ? '#fafafa' : getPriorityColor(priority),
                      borderLeft: `4px solid ${
                        expired ? '#e0e0e0' : 
                        priority.toLowerCase() === 'high' ? '#ef233c' :
                        priority.toLowerCase() === 'medium' ? '#ff9800' :
                        '#4caf50'
                      }`
                    }}
                  >
                    <td className="type-cell">
                      <div className="type-badge">
                        {getTypeIcon(notif.type)}
                      </div>
                    </td>
                    <td className="message-cell">
                      <div className="message-content">
                        <p className="message-text">{notif.text || "No message"}</p>
                        <span className="added-by">Added by: {notif.added_by_name}</span>
                      </div>
                    </td>
                    <td className="date-cell">
                      <div className="date-content">
                        <FiClock className={`date-icon ${expired ? 'expired-icon' : ''}`} />
                        <span className={expired ? 'expired-text' : ''}>
                          {notif.due_date ? 
                            new Date(notif.due_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 
                            'No date'
                          }
                        </span>
                        {expired && <span className="expired-indicator"></span>}
                      </div>
                    </td>
                    <td className="priority-cell">
                      <div className="priority-indicator">
                        {getPriorityIcon(priority)}
                      </div>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="delete-buttons"
                        onClick={() => deleteNotification(notif._id, notif.added_by)}
                        title="Delete notification"
                        disabled={loading}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;