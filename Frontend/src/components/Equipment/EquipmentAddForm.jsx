import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import '../../styles/Equipment/EquipmentAddForm.css';

const EquipmentAddForm = () => {
  const { user } = useSelector((state) => state.user);
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [users, setUsers] = useState([]);
  const [sponsorProjects, setSponsorProjects] = useState([]);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    ownership: user?.id || "",
    funding_by_srp_id: "",
    date_of_purchase: "",
    location: "",
    usingUser: "",
    amount: "",
    status: "available",
    remarks: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchEquipment();
      fetchUsersAndProjects();
    }
  }, [user]);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get(`/api/v1/equipment/${user.id}`);
      const formattedEquipment = response.data.equipment.map((equipment) => ({
        ...equipment,
        amount: equipment.amount|| "0",
        date_of_purchase: equipment.date_of_purchase 
          ? new Date(equipment.date_of_purchase).toISOString().split("T")[0] 
          : "",
      }));
      
      setEquipmentList(formattedEquipment);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      setMessage("Failed to fetch equipment.");
    }
  };

  const fetchUsersAndProjects = async () => {
    try {
      const usersResponse = await axios.get("/api/v1/user");
      setUsers(usersResponse.data);
      const sponsorProjectsResponse = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
      setSponsorProjects(sponsorProjectsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Failed to fetch required data.");
    }
  };

  const handleSelectEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setFormData({
      ...equipment,
      amount: equipment.amount?.$numberDecimal || "0",
      date_of_purchase: equipment.date_of_purchase
        ? new Date(equipment.date_of_purchase).toISOString().split("T")[0]
        : "",
    });
  };

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
      if (selectedEquipment) {
        await axios.put(`/api/v1/equipment/${selectedEquipment._id}`, formData);
        setMessage("Equipment updated successfully.");
      } else {
        await axios.post("/api/v1/equipment", formData);
        setMessage("Equipment added successfully.");
      }
      fetchEquipment();
      resetForm();
    } catch (error) {
      console.error("Error saving equipment:", error);
      setMessage("Failed to save equipment.");
    }
  };

  const handleDelete = async () => {
    if (!selectedEquipment) return;
    try {
      await axios.delete(`/api/v1/equipment/${selectedEquipment._id}`);
      setMessage("Equipment deleted successfully.");
      fetchEquipment();
      resetForm();
    } catch (error) {
      console.error("Error deleting equipment:", error);
      setMessage("Failed to delete equipment.");
    }
  };

  const resetForm = () => {
    setSelectedEquipment(null);
    setFormData({
      name: "",
      ownership: user?.id || "",
      funding_by_srp_id: "",
      date_of_purchase: "",
      location: "",
      usingUser: "",
      amount: "",
      status: "available",
      remarks: "",
    });
  };

  return (
    <div className="equipment-add-form-container">
      <h2 className="equipment-add-form-title">{selectedEquipment ? "Edit Equipment" : "Add Equipment"}</h2>
      {message && <p className="equipment-add-form-message">{message}</p>}

      <div className="equipment-add-form-list">
        <h3>Your Equipment</h3>
        <ul>
          {equipmentList.map((equipment) => (
            <li key={equipment._id} onClick={() => handleSelectEquipment(equipment)}>
              {equipment.name} - {equipment.status}
            </li>
          ))}
        </ul>
      </div>

      <form className="equipment-add-form-form" onSubmit={handleSubmit}>
        <div className="equipment-add-form-field">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="equipment-add-form-field">
          <label>Using User:</label>
          <select name="usingUser" value={formData.usingUser} onChange={handleChange} required>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
            ))}
          </select>
        </div>

        <div className="equipment-add-form-field">
          <label>Funding by Sponsor Project:</label>
          <select name="funding_by_srp_id" value={formData.funding_by_srp_id} onChange={handleChange} required>
            <option value="">Select Sponsor Project</option>
            {sponsorProjects.map((project) => (
              <option key={project._id} value={project._id}>{project.agency}</option>
            ))}
          </select>
        </div>

        <div className="equipment-add-form-field">
          <label>Date of Purchase:</label>
          <input type="date" name="date_of_purchase" value={formData.date_of_purchase} onChange={handleChange} />
        </div>

        <div className="equipment-add-form-field">
          <label>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div className="equipment-add-form-field">
          <label>Amount:</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} min="0" required />
        </div>

        <div className="equipment-add-form-field">
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value="available">Available</option>
            <option value="in use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="surrendered">Surrendered</option>
          </select>
        </div>

        <div className="equipment-add-form-field">
          <label>Remarks:</label>
          <textarea name="remarks" value={formData.remarks} onChange={handleChange}></textarea>
        </div>

        <button type="submit">{selectedEquipment ? "Update Equipment" : "Add Equipment"}</button>
        {/* {selectedEquipment && <button type="button" onClick={handleDelete}>Delete</button>} */}
        {selectedEquipment && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>
    </div>
  );
};

export default EquipmentAddForm;
