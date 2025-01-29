import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import '../styles/AddUser.css'

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "btech", // Default role
    status: true, // Default status
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.user);


  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Properly handle checkboxes and other inputs
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/user/add", formData); // Ensure the API endpoint is correct
      console.log(response.data);
      
      setMessage(`User created successfully: ${formData.name}`);
      // Reset form
      setFormData({
        name: "",
        role: "btech", // Reset to default role
        status: true, // Reset to default status
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="AddUserForm">
      <h2>Add User</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="AddUserForm-inputbox">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Role */}
        <div className="AddUserForm-inputbox">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="btech">btech</option>
            <option value="intern">intern</option>
            {user.role === "admin" && <option value="faculty">faculty</option>}
            <option value="mtech">mtech</option>
            <option value="phd">phd</option>
            <option value="projectstaff">projectstaff</option>
          </select>
        </div>

        {/* Status */}
        <div className="AddUserForm-inputbox">
          <label htmlFor="status">
            <input
              type="checkbox"
              id="status"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        {/* Email */}
        <div className="AddUserForm-inputbox">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="AddUserForm-inputbox">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUserForm;
