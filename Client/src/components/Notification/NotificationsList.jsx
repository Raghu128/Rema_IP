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
  FiInfo,
  FiTable,
  FiGrid
} from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import Loader from "../Loader";
import "../../styles/Notification/NotificationsList.css";

const NotificationsList = () => {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
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
        return <FiAlertCircle className="notifications-priority-icon notifications-high" />;
      case "medium":
        return <FiFlag className="notifications-priority-icon notifications-medium" />;
      case "low":
        return <FiInfo className="notifications-priority-icon notifications-low" />;
      default:
        return <FiInfo className="notifications-priority-icon" />;
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
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="notifications-header-left">
          <div className="notifications-title">
            <FiBell className="notifications-header-icon" />
            <h1>Notifications</h1>
            <span className="notifications-badge">{notifications.length}</span>
          </div>
        </div>
        <div className="notifications-header-right">
          <div className="notifications-view-toggle">
            <button 
              className={`notifications-view-button ${viewMode === 'table' ? 'notifications-active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <FiTable /> Table
            </button>
            <button 
              className={`notifications-view-button ${viewMode === 'card' ? 'notifications-active' : ''}`}
              onClick={() => setViewMode('card')}
            >
              <FiGrid /> Cards
            </button>
          </div>
          <button 
            className="notifications-add-button"
            onClick={() => navigate("/manage-notification")}
          >
            <FaEdit /> Manage
          </button>
        </div>
      </div>

      {error && (
        <div className="notifications-error-alert">
          <FiAlertTriangle /> {error}
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="notifications-empty-state">
          <div className="notifications-empty-icon">
            <FiBell />
          </div>
          <h3>No notifications yet</h3>
          <p>Create your first notification to get started</p>
        </div>
      )}

{!loading && !error && notifications.length > 0 && (
        viewMode === 'table' ? (
          <div className="notifications-table-container">
            <table className="notifications-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Due Date</th>
                  {/* <th>Priority</th> */}
                  <th>Added By</th>
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
                      className={`notifications-row ${expired ? 'notifications-expired' : ''}`}
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
                      <td className="notifications-type-cell">
                        <div className="notifications-type-badge">
                          {getTypeIcon(notif.type)}
                        </div>
                      </td>
                      <td className="notifications-message-cell">
                        <div className="notifications-message-content">
                          <p className="notifications-message-text">{notif.text || "No message"}</p>
                        </div>
                      </td>
                      <td className="notifications-date-cell">
                        <div className="notifications-date-content">
                          <FiClock className={`notifications-date-icon ${expired ? 'notifications-expired-icon' : ''}`} />
                          <span className={expired ? 'notifications-expired-text' : ''}>
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
                          {expired && <span className="notifications-expired-indicator"></span>}
                        </div>
                      </td>
                      {/* <td className="notifications-priority-cell">
                        <div className="notifications-priority-indicator">
                          {getPriorityIcon(priority)}
                        </div>
                      </td> */}
                      <td className="notifications-added-by-cell">
                        {notif.added_by_name}
                      </td>
                      <td className="notifications-actions-cell">
                        <button
                          className="notifications-delete-button"
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
        ) : (
          <div className="notifications-cards-container">
            {notifications.map((notif) => {
              const expired = isExpired(notif.due_date);
              const priority = notif.priority || "";
              
              return (
                <div 
                  key={notif._id} 
                  className={`notifications-card ${expired ? 'notifications-expired' : ''}`}
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
                  <div className="notifications-card-header">
                    <div className="notifications-card-type">
                      {getTypeIcon(notif.type)}
                    </div>
                    <div className="notifications-card-priority">
                      {getPriorityIcon(priority)}
                    </div>
                  </div>
                  
                  <div className="notifications-card-body">
                    <p className="notifications-card-message">
                      {notif.text || "No message"}
                    </p>
                    <div className="notifications-card-added-by">
                      Added by: {notif.added_by_name}
                    </div>
                  </div>
                  
                  <div className="notifications-card-footer">
                    <div className="notifications-card-date">
                      <FiClock className={`notifications-date-icon ${expired ? 'notifications-expired-icon' : ''}`} />
                      <span className={expired ? 'notifications-expired-text' : ''}>
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
                      {expired && <span className="notifications-expired-indicator">Expired</span>}
                    </div>
                    <button
                      className="notifications-card-delete-button"
                      onClick={() => deleteNotification(notif._id, notif.added_by)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

    </div>
  );
};

export default NotificationsList;