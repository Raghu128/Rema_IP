// AddLeaveForm.js
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Leaves/AddLeaveForm.css"; // Make sure you have this CSS file
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faEdit, faCalendarAlt, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

const AddLeaveForm = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [faculty, setFaculty] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        reason: "",
    });
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingLeaveId, setEditingLeaveId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await axios.get("/api/v1/user");
                setFaculty(response.data.filter((facultyMember) => facultyMember.role === "faculty" && facultyMember.role !== "admin"));
            } catch (error) {
                console.error("Error fetching faculty:", error);
            }
        };

        fetchFaculty();
    }, []);

    useEffect(() => {
        if (selectedFaculty) {
            fetchLeaves(selectedFaculty);
        }
    }, [selectedFaculty]);

    const fetchLeaves = async (facultyId) => {
        try {
          const response = await axios.get(`/api/v1/leaves/${user?.id}`);
            const formattedLeaves = response.data.map((leave) => ({
                ...leave,
                from: leave.from.split("T")[0],
                to: leave.to.split("T")[0],
            }));
            setLeaves(formattedLeaves);
        } catch (error) {
            console.error("Error fetching leaves:", error);
        }
    };

    const handleFacultyChange = (e) => {
        setSelectedFaculty(e.target.value);
        setIsEditing(false);
        setEditingLeaveId(null);
        setFormData({ from: "", to: "", reason: "" });
        setMessage(""); // Clear messages
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (leave) => {
        setFormData({ from: leave.from, to: leave.to, reason: leave.reason });
        setIsEditing(true);
        setEditingLeaveId(leave._id);
    };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
          if (isEditing) {
            await axios.put(`/api/v1/leaves/${editingLeaveId}`, formData);
            setMessage("Leave updated successfully.");
          } else {
            await axios.post("/api/v1/leaves", {
              ...formData,
              user_id: user.id,
              faculty_id: selectedFaculty,
            });
            setMessage("Leave added successfully.");
          }

          // Refresh leaves list after adding or updating
          fetchLeaves(selectedFaculty);

          // Reset form and editing state
            setIsEditing(false);
            setEditingLeaveId(null);
            setFormData({ from: "", to: "", reason: "" });


        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage("Failed to process leave request." ); // More specific error message
        }
    };


    const handleDelete = async (leaveId) => {
        try {
            await axios.delete(`/api/v1/leaves/${leaveId}`);
            setMessage("Leave deleted successfully.");
          fetchLeaves(selectedFaculty);
            // You might want to update the leaves state here after successful deletion
        } catch (error) {
            console.error("Error deleting leave:", error);
             setMessage("Failed to delete leave.");
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingLeaveId(null);
        setFormData({ from: "", to: "", reason: "" });
        setMessage(""); // Clear any previous messages
    };

  const filteredFaculty = faculty.filter(facultyMember =>
        facultyMember.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


  return (
        <div className="leaves-form-container">
      {/* Back Button */}
            <button className="leaves-back-btn" onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft} /> Go Back
            </button>
            <h2 className="leaves-title">Add Leaves</h2>

      {/* Search Bar */}
            <div className="leaves-search-container">
                <FontAwesomeIcon icon={faSearch} className="leaves-search-icon" />
                <input
                    type="text"
                    placeholder="Search faculty..."
                    className="leaves-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>


            {/* Faculty Select Dropdown */}
          <div className="leaves-student-select-section"> {/* Updated label and variable names */}
            <label htmlFor="facultySelect" className="leaves-label">Select Faculty:</label>
            <select id="facultySelect" className="leaves-select" value={selectedFaculty} onChange={handleFacultyChange} required>
                <option value="">Select a Faculty here</option>
                {filteredFaculty.map((facultyMember) => (
                    <option key={facultyMember._id} value={facultyMember._id}>
                        {facultyMember.name} ({facultyMember.email})
                    </option>
                ))}
            </select>
        </div>

            {selectedFaculty && (
                <>
                    {/* Add/Edit Leave Form */}
           <h3 className="leaves-subtitle">{isEditing ? "Edit Leave" : "Add New Leave"}</h3>
           {/* Display messages */}
                    {message && <p className={`leaves-message ${message.includes("Failed") ? "error" : ""}`}>{message}</p>}
                    <form className="leaves-form" onSubmit={handleSubmit}>
                    <div className="leaves-form-row">
              <div className="leaves-form-group">
                <label htmlFor="from">From Date:</label>
                <input type="date" id="from" name="from" value={formData.from} onChange={handleChange} required />
              </div>
              <div className="leaves-form-group">
                <label htmlFor="to">To Date:</label>
                <input type="date" id="to" name="to" value={formData.to} onChange={handleChange} required/>
              </div>
            </div>
            <div className="leaves-form-group">
              <label htmlFor="reason">Reason:</label>
              <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} required />
                        </div>
                        <div className="leaves-form-actions">
              <button type="submit" className="leaves-submit-btn">
                {isEditing ? (
                   <> <FontAwesomeIcon icon={faEdit} />Update</>
                ) : (
                    <> <FontAwesomeIcon icon={faPlus} />Add Leave</>
                )}
                            </button>

                            {/* Cancel Button (only during edit mode) */}
                            {isEditing && (
                                <button type="button" className="leaves-cancel-btn" onClick={handleCancelEdit}>
                                    Cancel
                 </button>
                            )}
                        </div>

                    </form>
                </>
            )}
        </div>
    );
};


export default AddLeaveForm;