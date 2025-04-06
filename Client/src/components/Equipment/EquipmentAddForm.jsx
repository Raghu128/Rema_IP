import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faPlus, faEdit, 
  faTrash, faSearch, faCalendarAlt,
  faMoneyBillWave, faUser, faBuilding
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/Equipment/EquipmentAddForm.css';


const EquipmentAddForm = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [equipmentList, setEquipmentList] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [users, setUsers] = useState([]);
    const [sponsorProjects, setSponsorProjects] = useState([]);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    
    

    const [formData, setFormData] = useState({
        name: "",
        ownership: user?.id || "",
        funding_by_srp_id: "",
        date_of_purchase: "",
        location: "",
        usingUser: user?.id,
        amount: "",
        status: "available",
        remarks: "",
    });



    useEffect(() => {
        if (!user) navigate("/");
    }, [user, navigate]);

    useEffect(() => {
        if (user?.id) {
            fetchEquipment();
            fetchUsersAndProjects();
        }
    }, [user?.id]);

    const fetchEquipment = async () => {
        try {
          const response = await axios.get(`/api/v1/equipment/${user.id}`);
          const formattedEquipment = response.data.equipment.map(equipment => ({
            ...equipment,
            amount: equipment.amount?.$numberDecimal || equipment.amount || "0", // Handle both formats
            date_of_purchase: equipment.date_of_purchase
              ? new Date(equipment.date_of_purchase).toISOString().split("T")[0]
              : "",
              usingUser: equipment.usingUser?._id || equipment.usingUser || ""
          }));
          setEquipmentList(formattedEquipment);
        } catch (error) {
          console.error("Error fetching equipment:", error);
          setMessage("Failed to fetch equipment.");
        }
      };
    const fetchUsersAndProjects = async () => {
        try {
            const [usersResponse, projectsResponse] = await Promise.all([
                axios.get(`/api/v1/user/${user?.id}`),
                axios.get(`/api/v1/sponsor-projects/${user.id}`)
            ]);
            setUsers(usersResponse.data);
            setSponsorProjects(projectsResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage("Failed to fetch required data.");
        }
    };

    const handleSelectEquipment = (equipment) => {
        setSelectedEquipment(equipment);
        setFormData({
            ...equipment,
            funding_by_srp_id: equipment.funding_by_srp_id?._id || equipment.funding_by_srp_id || "", // Ensure correct selection
            usingUser: equipment.usingUser?._id || equipment.usingUser || "",
            date_of_purchase: equipment.date_of_purchase
                ? new Date(equipment.date_of_purchase).toISOString().split("T")[0]
                : "",
        });
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...formData,
                ownership: user?.id,
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

    const filteredEquipmentList = equipmentList.filter(equipment =>
        equipment.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="expenses-equipment-container">
            <div className="expenses-equipment-header">
                <button onClick={() => navigate(-1)} className="expenses-back-btn">
                    <FontAwesomeIcon icon={faArrowLeft} /> Go Back
                </button>
                <h2 className="expenses-equipment-title">
                    {selectedEquipment ? "Edit Equipment" : "Add Equipment"}
                </h2>
            </div>

            {message && (
                <div className={`expenses-message ${message.includes("successfully") ? "success" : "error"}`}>
                    {message}
                </div>
            )}

            <div className="expenses-equipment-content">
                {/* Equipment List Sidebar */}
                <div className="expenses-equipment-list-container">
                    <div className="expenses-search-container">
                        <FontAwesomeIcon icon={faSearch} className="expenses-search-icon" />
                        <input
                            type="text"
                            placeholder="Search equipment..."
                            className="expenses-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="expenses-equipment-list">
                        <h3 className="expenses-list-title">Your Equipment</h3>
                        <ul className="expenses-equipment-items">
                            {filteredEquipmentList.map(equipment => (
                                <li 
                                    key={equipment._id} 
                                    onClick={() => handleSelectEquipment(equipment)}
                                    className={`expenses-equipment-item ${selectedEquipment?._id === equipment._id ? 'active' : ''}`}
                                >
                                    <div className="expenses-equipment-item-name">{equipment.name}</div>
                                    <div className="expenses-equipment-item-details">
                                        <span className={`expenses-status-badge ${equipment.status}`}>
                                            {equipment.status}
                                        </span>
                                        <span className="expenses-equipment-price">
                                            <FontAwesomeIcon icon={faMoneyBillWave} /> 
                                            {parseFloat(equipment.amount).toFixed(2)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Form Section */}
                <div className="expenses-equipment-form-container">
                    <form className="expenses-equipment-form" onSubmit={handleSubmit}>
                        <div className="expenses-form-section">
                            <h3 className="expenses-section-title">Equipment Details</h3>
                            
                            <div className="expenses-form-row">
                                <div className="expenses-form-group">
                                    <label htmlFor="name" className="expenses-form-label">Name</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        className="expenses-form-input"
                                        required 
                                    />
                                </div>
                                
                                <div className="expenses-form-group">
                                    <label htmlFor="location" className="expenses-form-label">Location</label>
                                    <input 
                                        type="text" 
                                        id="location" 
                                        name="location" 
                                        value={formData.location} 
                                        onChange={handleChange} 
                                        className="expenses-form-input"
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="expenses-form-row">
                                <div className="expenses-form-group">
                                    <label htmlFor="funding_by_srp_id" className="expenses-form-label">Sponsor Project</label>
                                    <select 
                                        id="funding_by_srp_id" 
                                        name="funding_by_srp_id" 
                                        value={formData.funding_by_srp_id} 
                                        onChange={handleChange} 
                                        className="expenses-form-select"
                                        // required
                                    >
                                        <option value="">Select Sponsor Project</option>
                                        {sponsorProjects.map(project => (
                                            <option key={project._id} value={project._id}>
                                                {project.title} ({project.agency})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="expenses-form-group">
                                    <label htmlFor="usingUser" className="expenses-form-label">Using User</label>
                                    <select 
                                        id="usingUser" 
                                        name="usingUser" 
                                        value={formData.usingUser} 
                                        onChange={handleChange} 
                                        className="expenses-form-select"
                                    >
                                        <option value="">Select User</option>
                                        {users.map(user => (
                                            <option key={user._id} value={user._id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="expenses-form-row">
                                <div className="expenses-form-group">
                                    <label htmlFor="date_of_purchase" className="expenses-form-label">Purchase Date</label>
                                    <div className="expenses-input-with-icon">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="expenses-input-icon" />
                                        <input 
                                            type="date" 
                                            id="date_of_purchase" 
                                            name="date_of_purchase" 
                                            value={formData.date_of_purchase} 
                                            onChange={handleChange} 
                                            className="expenses-form-input"
                                        />
                                    </div>
                                </div>
                                
                                <div className="expenses-form-group">
                                    <label htmlFor="amount" className="expenses-form-label">Amount</label>
                                    <div className="expenses-input-with-icon">
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="expenses-input-icon" />
                                        <input 
                                            type="number" 
                                            id="amount" 
                                            name="amount" 
                                            value={formData.amount} 
                                            onChange={handleChange} 
                                            className="expenses-form-input"
                                            min="0" 
                                            step="0.01"
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="expenses-form-row">
                                <div className="expenses-form-group">
                                    <label htmlFor="status" className="expenses-form-label">Status</label>
                                    <select 
                                        id="status" 
                                        name="status" 
                                        value={formData.status} 
                                        onChange={handleChange} 
                                        className="expenses-form-select"
                                        required
                                    >
                                        <option value="available">Available</option>
                                        <option value="in use">In Use</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="surrendered">Surrendered</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="expenses-form-group">
                                <label htmlFor="remarks" className="expenses-form-label">Remarks</label>
                                <textarea 
                                    id="remarks" 
                                    name="remarks" 
                                    value={formData.remarks} 
                                    onChange={handleChange} 
                                    className="expenses-form-textarea"
                                ></textarea>
                            </div>
                        </div>
                        
                        <div className="expenses-form-actions">
                            <button type="submit" className="expenses-submit-btn">
                                {selectedEquipment ? (
                                    <>
                                        <FontAwesomeIcon icon={faEdit} /> Update Equipment
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faPlus} /> Add Equipment
                                    </>
                                )}
                            </button>
                            
                            {selectedEquipment && (
                                <>
                                    <button 
                                        type="button" 
                                        onClick={handleDelete} 
                                        className="expenses-delete-btn"
                                    >
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={resetForm} 
                                        className="expenses-cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EquipmentAddForm;