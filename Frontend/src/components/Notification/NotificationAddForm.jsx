import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import '../../styles/Notification/AddForm.css'
import { useNavigate } from "react-router-dom";

const NotificationAddForm = () => {
  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "",
    text: "",
    creation_date: "",
    due_date: "",
    priority: "low",
    added_by: user?.id || "",
    view: [],
  });

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to home if user is null
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/user");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      added_by: user?.id || "",
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      view: checked
        ? [...prevState.view, value]
        : prevState.view.filter((id) => id !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/v1/notifications", formData);
      setMessage(`Notification added successfully: ${response.data.text}`);

      setFormData({
        type: "",
        text: "",
        creation_date: "",
        due_date: "",
        priority: "low",
        added_by: user?.id || "",
        view: [],
      });
    } catch (error) {
      console.error("Error adding notification:", error);
      setMessage(error.response?.data?.message || "Failed to add notification.");
    }
  };

  return (
    <div className="notification-container">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h2 className="notification-title">Add Notification</h2>
      {message && <p className="notification-message">{message}</p>}
      <form onSubmit={handleSubmit} className="notification-form">
      <div className="notification-field">
  <label htmlFor="type">Type:</label>
  <select
    id="type"
    name="type"
    value={formData.type}
    onChange={handleChange}
    required
    className="notification-input"
  >
    <option value="">Select Type</option>
    <option value="reminder">Reminder</option>
    <option value="todo">To-Do</option>
    <option value="deadline">Deadline</option>
    <option value="other">Other</option>
  </select>
</div>


        <div className="notification-field">
          <label htmlFor="text">Text:</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            className="notification-textarea"
          ></textarea>
        </div>

        <div className="notification-field">
          <label htmlFor="creation_date">Creation Date:</label>
          <input
            type="date"
            id="creation_date"
            name="creation_date"
            value={formData.creation_date}
            onChange={handleChange}
            required
            className="notification-input"
          />
        </div>

        <div className="notification-field">
          <label htmlFor="due_date">Due Date:</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="notification-input"
          />
        </div>

        <div className="notification-field">
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="notification-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="notification-field notification-checkbox-group">
          <label>View Access:</label>
          <div className="notification-checkbox-container">
            {users.map((user) => (
              <label key={user._id} className="notification-checkbox-label">
                <input
                  type="checkbox"
                  value={user._id}
                  checked={formData.view.includes(user._id)}
                  onChange={handleCheckboxChange}
                  className="notification-checkbox"
                />
                {user.email}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="notification-button">
          Add Notification
        </button>
      </form>
    </div>
  );
};

export default NotificationAddForm;
