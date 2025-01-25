import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificationAddForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    text: "",
    creation_date: "",
    due_date: "",
    priority: "low", // Default priority
    added_by: "",
    view: [], // Array of user IDs for view access
  });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch users for 'added_by' and 'view'
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/users"); // Replace with your user-fetching API endpoint
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle checkbox change for 'view'
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const updatedView = checked
        ? [...prevState.view, value] // Add user ID if checked
        : prevState.view.filter((id) => id !== value); // Remove user ID if unchecked
      return { ...prevState, view: updatedView };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/notifications", formData); // Replace with your notification-add API endpoint
      setMessage(`Notification added successfully: ${response.data.text}`);
      // Reset form
      setFormData({
        type: "",
        text: "",
        creation_date: "",
        due_date: "",
        priority: "low",
        added_by: "",
        view: [],
      });
    } catch (error) {
      console.error("Error adding notification:", error);
      setMessage(error.response?.data?.message || "Failed to add notification.");
    }
  };

  return (
    <div>
      <h2>Add Notification</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Notification Type */}
        <div>
          <label htmlFor="type">Type:</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>

        {/* Notification Text */}
        <div>
          <label htmlFor="text">Text:</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Creation Date */}
        <div>
          <label htmlFor="creation_date">Creation Date:</label>
          <input
            type="date"
            id="creation_date"
            name="creation_date"
            value={formData.creation_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="due_date">Due Date:</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Added By */}
        <div>
          <label htmlFor="added_by">Added By:</label>
          <select
            id="added_by"
            name="added_by"
            value={formData.added_by}
            onChange={handleChange}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* View Access */}
        <div>
          <label>View Access:</label>
          <div>
            {users.map((user) => (
              <div key={user._id}>
                <label>
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={formData.view.includes(user._id)}
                    onChange={handleCheckboxChange}
                  />
                  {user.name} ({user.email})
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Add Notification</button>
      </form>
    </div>
  );
};

export default NotificationAddForm;
