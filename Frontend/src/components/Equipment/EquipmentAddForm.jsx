import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import '../../styles/Equipment/EquipmentAddForm.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

const EquipmentAddForm = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [equipmentList, setEquipmentList] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [users, setUsers] = useState([]);
    const [sponsorProjects, setSponsorProjects] = useState([]);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // For searching in the equipment list


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
        if (!user) {
            navigate("/"); // Redirect to home if user is null
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user?.id) {
            fetchEquipment();
            fetchUsersAndProjects();
        }
    }, [user?.id]); // Correct dependency

    const fetchEquipment = async () => {
        try {
            const response = await axios.get(`/api/v1/equipment/${user.id}`);
            const formattedEquipment = response.data.equipment.map((equipment) => ({
                ...equipment,
                amount: equipment.amount || "0",  //Handle undefined/null
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
            ...equipment, // Correctly spread existing equipment data
            date_of_purchase: equipment.date_of_purchase
                ? new Date(equipment.date_of_purchase).toISOString().split("T")[0]
                : "", // Ensure a valid date format
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
            const submissionData = {
                ...formData,
                ownership: user?.id, // Ensure ownership is always set
            };

            if (selectedEquipment) {
                await axios.put(`/api/v1/equipment/${selectedEquipment._id}`, submissionData);
                setMessage("Equipment updated successfully.");
            } else {
                await axios.post("/api/v1/equipment", submissionData);
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

      // Filter equipment list based on search query
      const filteredEquipmentList = equipmentList.filter(equipment =>
        equipment.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="equipment-add-form-container">
            <button onClick={() => navigate(-1)} className="equipment-add-form-back-btn">
               <FontAwesomeIcon icon={faArrowLeft} /> Go Back
            </button>
            <h2 className="equipment-add-form-title">{selectedEquipment ? "Edit Equipment" : "Add Equipment"}</h2>
            {message && <p className={message.startsWith("Equipment added") ? "equipment-add-form-message" : "equipment-add-form-message error"}>{message}</p>}

            {/* Search Bar */}
            <div className="equipment-add-form-search-container">
              <FontAwesomeIcon icon={faSearch} className="equipment-add-form-search-icon" />
                <input
                    type="text"
                    placeholder="Search existing equipment..."
                    className="equipment-add-form-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="equipment-add-form-list">
                <h3 className="equipment-add-form-list-title">Your Equipment</h3>
                <ul className="equipment-add-form-items-list">
                    {filteredEquipmentList.map((equipment) => (  /* Use filtered list here */
                        <li key={equipment._id} onClick={() => handleSelectEquipment(equipment)} className="equipment-add-form-item">
                            {equipment.name} - {equipment.status}
                        </li>
                    ))}
                </ul>
            </div>

            <form className="equipment-add-form-form" onSubmit={handleSubmit}>
                <div className="equipment-form-row">
                    <div className="equipment-add-form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="equipment-add-form-group">
                        <label htmlFor="usingUser">Using User:</label>
                        <select id="usingUser" name="usingUser" value={formData.usingUser} onChange={handleChange} required>
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="equipment-form-row">
                    <div className="equipment-add-form-group">
                        <label htmlFor="funding_by_srp_id">Funding by Sponsor Project:</label>
                        <select id="funding_by_srp_id" name="funding_by_srp_id" value={formData.funding_by_srp_id} onChange={handleChange} required>
                            <option value="">Select Sponsor Project</option>
                            {sponsorProjects.map((project) => (
                                <option key={project._id} value={project._id}>{project.agency}</option>
                            ))}
                        </select>
                    </div>

                    <div className="equipment-add-form-group">
                        <label htmlFor="date_of_purchase">Date of Purchase:</label>
                        <input type="date" id="date_of_purchase" name="date_of_purchase" value={formData.date_of_purchase} onChange={handleChange} />
                    </div>
                </div>

                <div className="equipment-form-row">
                    <div className="equipment-add-form-group">
                        <label htmlFor="location">Location:</label>
                        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
                    </div>

                    <div className="equipment-add-form-group">
                        <label htmlFor="amount">Amount:</label>
                        <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} min="0" required />
                    </div>
                </div>

                <div className="equipment-form-row">
                <div className="equipment-add-form-group">
                        <label htmlFor="status">Status:</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                            <option value="available">Available</option>
                            <option value="in use">In Use</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="surrendered">Surrendered</option>
                        </select>
                    </div>
                   <div className="equipment-add-form-group">
                        <label htmlFor="remarks">Remarks:</label>
                        <textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleChange}></textarea>
                    </div>
                </div>
                <div className="equipment-add-form-actions">
                  <button type="submit" className="equipment-add-form-submit-btn">
                    {selectedEquipment ? <span><FontAwesomeIcon icon={faEdit}/> Update Equipment</span> : <span><FontAwesomeIcon icon={faPlus} /> Add Equipment</span>}
                  </button>
                  {selectedEquipment && (
                    <>
                      <button type="button" className="equipment-add-form-delete-btn" onClick={handleDelete}>
                       <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                      <button type="button" className="equipment-add-form-cancel-btn" onClick={resetForm}>
                        Cancel
                    </button>
                    </>
                  )}
                </div>
            </form>
        </div>
    );
};

export default EquipmentAddForm;