import React, { useState, useEffect } from "react";
import axios from "axios";

const EquipmentAddForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    ownership: "",
    funding_by_srp_id: "",
    date_of_purchase: "",
    location: "",
    amount: "",
    status: "available", // Default status
    remarks: "",
  });

  const [users, setUsers] = useState([]);
  const [sponsorProjects, setSponsorProjects] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch users and sponsor projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("/api/v1/users"); // Replace with your user-fetching API endpoint
        setUsers(usersResponse.data);

        const sponsorProjectsResponse = await axios.get("/api/v1/sponsor-projects"); // Replace with your sponsor projects API endpoint
        setSponsorProjects(sponsorProjectsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to fetch required data.");
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/equipment", formData); // Replace with your equipment-add API endpoint
      setMessage(`Equipment added successfully: ${response.data.name}`);
      // Reset form
      setFormData({
        name: "",
        ownership: "",
        funding_by_srp_id: "",
        date_of_purchase: "",
        location: "",
        amount: "",
        status: "available",
        remarks: "",
      });
    } catch (error) {
      console.error("Error adding equipment:", error);
      setMessage(error.response?.data?.message || "Failed to add equipment.");
    }
  };

  return (
    <div>
      <h2>Add Equipment</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Equipment Name */}
        <div>
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

        {/* Ownership */}
        <div>
          <label htmlFor="ownership">Ownership:</label>
          <select
            id="ownership"
            name="ownership"
            value={formData.ownership}
            onChange={handleChange}
            required
          >
            <option value="">Select Owner</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Funding By Sponsor Project */}
        <div>
          <label htmlFor="funding_by_srp_id">Funding by Sponsor Project:</label>
          <select
            id="funding_by_srp_id"
            name="funding_by_srp_id"
            value={formData.funding_by_srp_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Sponsor Project</option>
            {sponsorProjects.map((project) => (
              <option key={project._id} value={project._id}>
             {project.agency}
              </option>
            ))}
          </select>
        </div>

        {/* Date of Purchase */}
        <div>
          <label htmlFor="date_of_purchase">Date of Purchase:</label>
          <input
            type="date"
            id="date_of_purchase"
            name="date_of_purchase"
            value={formData.date_of_purchase}
            onChange={handleChange}
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="available">Available</option>
            <option value="in use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="surrendered">Surrendered</option>
          </select>
        </div>

        {/* Remarks */}
        <div>
          <label htmlFor="remarks">Remarks:</label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit">Add Equipment</button>
      </form>
    </div>
  );
};

export default EquipmentAddForm;
