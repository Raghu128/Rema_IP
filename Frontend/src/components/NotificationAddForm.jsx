import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const NotificationAddForm = () => {
  const { user } = useSelector((state) => state.user); // Get logged-in user
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // Initial state with logged-in user's ID for added_by
  const [formData, setFormData] = useState({
    type: "",
    text: "",
    creation_date: "",
    due_date: "",
    priority: "low",
    added_by: user?.id || "", // Automatically assign logged-in user's ID
    view: [], // Store selected user IDs for view access
  });

  // Fetch users for 'added_by' and 'view'
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/user"); // Replace with actual API endpoint
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  // Ensure 'added_by' updates if user changes (useful if data loads dynamically)
  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      added_by: user?.id || "",
    }));
  }, [user]);

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
    setFormData((prevState) => ({
      ...prevState,
      view: checked
        ? [...prevState.view, value] // Add user ID if checked
        : prevState.view.filter((id) => id !== value), // Remove user ID if unchecked
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    
    // try {
    //   const response = await axios.post("/api/v1/notifications", formData); // Replace with your API
    //   setMessage(`Notification added successfully: ${response.data.text}`);
      
    //   // Reset form, but keep added_by set to logged-in user
    //   setFormData({
    //     type: "",
    //     text: "",
    //     creation_date: "",
    //     due_date: "",
    //     priority: "low",
    //     added_by: user?.id || "",
    //     view: [],
    //   });
    // } catch (error) {
    //   console.error("Error adding notification:", error);
    //   setMessage(error.response?.data?.message || "Failed to add notification.");
    // }
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

        {/* View Access (Multi-checkbox) */}
        <div>
          <label>View Access:</label>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {users.map((user) => (
              <label key={user._id} style={{ marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  value={user._id}
                  checked={formData.view.includes(user._id)}
                  onChange={handleCheckboxChange}
                />
                {user.name} ({user.email})
              </label>
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
