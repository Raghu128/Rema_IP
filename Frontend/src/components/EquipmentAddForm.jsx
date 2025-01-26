import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import '../styles/EquipmentAddForm.css';

const EquipmentAddForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    ownership: "",
    funding_by_srp_id: "",
    date_of_purchase: "",
    location: "",
    usingUser: "", // Added this field
    amount: "",
    status: "available", // Default status
    remarks: "",
  });

  const { user } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [sponsorProjects, setSponsorProjects] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.id) {
      setFormData((prevData) => ({
        ...prevData,
        ownership: user.id,
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("/api/v1/user");
        setUsers(usersResponse.data);

        if (user && user.id) {
          const sponsorProjectsResponse = await axios.get(
            `/api/v1/sponsor-projects/${user.id}`
          );
          setSponsorProjects(sponsorProjectsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to fetch required data.");
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/v1/equipment", formData);
      setMessage(`Equipment added successfully: ${response.data.name}`);
      setFormData({
        name: "",
        ownership: user.id,
        funding_by_srp_id: "",
        date_of_purchase: "",
        location: "",
        usingUser: "",
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
    <div className="equipment-container">
      <h2 className="equipment-title">Add Equipment</h2>
      {message && <p className="equipment-message">{message}</p>}
      <form className="equipment-form" onSubmit={handleSubmit}>
        <div className="equipment-field">
          <label htmlFor="name" className="equipment-label">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="equipment-input"
            required
          />
        </div>

        <div className="equipment-field">
          <label htmlFor="usingUser" className="equipment-label">Using User:</label>
          <select
            id="usingUser"
            name="usingUser"
            value={formData.usingUser}
            onChange={handleChange}
            className="equipment-select"
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

        <div className="equipment-field">
          <label htmlFor="funding_by_srp_id" className="equipment-label">Funding by Sponsor Project:</label>
          <select
            id="funding_by_srp_id"
            name="funding_by_srp_id"
            value={formData.funding_by_srp_id}
            onChange={handleChange}
            className="equipment-select"
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

        <div className="equipment-field">
          <label htmlFor="date_of_purchase" className="equipment-label">Date of Purchase:</label>
          <input
            type="date"
            id="date_of_purchase"
            name="date_of_purchase"
            value={formData.date_of_purchase}
            onChange={handleChange}
            className="equipment-input"
          />
        </div>

        <div className="equipment-field">
          <label htmlFor="location" className="equipment-label">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="equipment-input"
            required
          />
        </div>

        <div className="equipment-field">
          <label htmlFor="amount" className="equipment-label">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="equipment-input"
            min="0"
            required
          />
        </div>

        <div className="equipment-field">
          <label htmlFor="status" className="equipment-label">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="equipment-select"
            required
          >
            <option value="available">Available</option>
            <option value="in use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="surrendered">Surrendered</option>
          </select>
        </div>

        <div className="equipment-field">
          <label htmlFor="remarks" className="equipment-label">Remarks:</label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="equipment-textarea"
          ></textarea>
        </div>

        <button type="submit" className="equipment-submit-button">Add Equipment</button>
      </form>
    </div>
  );
};

export default EquipmentAddForm;
