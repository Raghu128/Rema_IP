import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Leaves/AddLeaveForm.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faEdit, faCalendarAlt, faUser, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

const AddLeaveForm = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [selectedStudent, setSelectedStudent] = useState("");
    const [students, setStudents] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        reason: "",
    });
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingLeaveId, setEditingLeaveId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // For searching students

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get("/api/v1/user");
                setStudents(
                    response.data.filter(
                        (student) => student.role !== "faculty" && student.role !== "admin"
                    )
                );
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            fetchLeaves(selectedStudent);
        }
    }, [selectedStudent]);

    const fetchLeaves = async (studentId) => {
        try {
            const response = await axios.get(`/api/v1/leaves/${studentId}`);
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

    const handleStudentChange = (e) => {
        setSelectedStudent(e.target.value);
        setIsEditing(false);
        setEditingLeaveId(null);
        setFormData({ from: "", to: "", reason: "" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleEdit = (leave) => {
        setFormData({
            from: leave.from,
            to: leave.to,
            reason: leave.reason,
        });
        setIsEditing(true);
        setEditingLeaveId(leave._id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            if (isEditing) {
                await axios.put(`/api/v1/leaves/${editingLeaveId}`, formData);
                setMessage("Leave updated successfully");
            } else {
                await axios.post("/api/v1/leaves", {
                    ...formData,
                    user: selectedStudent,
                });
                setMessage("Leave added successfully");
            }
            setIsEditing(false);
            setEditingLeaveId(null);
            setFormData({ from: "", to: "", reason: "" });
            fetchLeaves(selectedStudent);
        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage("Failed to process leave request");
        }
    };
     const handleDelete = async () => {
        if (!editingLeaveId) return; // Should not happen, but good to check

        try {
            await axios.delete(`/api/v1/leaves/${editingLeaveId}`);
            setMessage("Leave deleted successfully.");
            setIsEditing(false); // Clear editing state
            setEditingLeaveId(null);
            setFormData({ from: "", to: "", reason: "" }); // Clear form
            fetchLeaves(selectedStudent); // Refresh leaves list
        } catch (error) {
            console.error("Error deleting leave:", error);
            setMessage("Failed to delete leave.");
        }
    };
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingLeaveId(null);
        setFormData({ from: "", to: "", reason: "" }); //Clear form
        setMessage(""); // Clear any messages
    }

    // Filter students based on search query
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="leaves-form-container">
            <button className="leaves-back-btn" onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft} /> Go Back
            </button>
            <h2 className="leaves-title">Manage Leaves</h2>

            {/* Search Bar */}
            <div className="leaves-search-container">
                <FontAwesomeIcon icon={faSearch} className="leaves-search-icon" />
                <input
                    type="text"
                    placeholder="Search students..."
                    className="leaves-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="leaves-student-select-section">
              <label htmlFor="studentSelect" className="leaves-label">Select Student:</label>
              <select id="studentSelect" className="leaves-select" value={selectedStudent} onChange={handleStudentChange} required>
                <option value="">Select a student here</option>
                {filteredStudents.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
           </div>

            {selectedStudent && (
                <>
                    <h3 className="leaves-subtitle">Existing Leaves</h3>
                    {leaves.length === 0 ? (
                        <p className="leaves-message">No leave records found.</p>
                    ) : (
                        <div className="leaves-list-container">
                            {leaves.map((leave) => (
                                <div key={leave._id} className="leaves-card">
                                    <div>
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        <span> {leave.from} to {leave.to}</span>
                                    </div>
                                    <p>Reason: {leave.reason}</p>
                                     <div className="leaves-card-actions">
                                        <button className="leaves-edit-btn" onClick={() => handleEdit(leave)}>
                                            <FontAwesomeIcon icon={faEdit} /> Edit
                                        </button>
                                         <button className="leaves-delete-btn" onClick={handleDelete}>
                                            <FontAwesomeIcon icon={faTrash} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                     <h3 className="leaves-subtitle">{isEditing ? "Edit Leave" : "Add New Leave"}</h3>
                    {message && <p className={message.startsWith("Leave added") ? "leaves-message" : "leaves-message error"}>{message}</p>}

                    <form className="leaves-form" onSubmit={handleSubmit}>
                        <div className="leaves-form-row">
                            <div className="leaves-form-group">
                                <label htmlFor="from" className="leaves-label">From Date:</label>
                                <input id="from" className="leaves-input" type="date" name="from" value={formData.from} onChange={handleChange} required />
                            </div>
                            <div className="leaves-form-group">
                                <label htmlFor="to" className="leaves-label">To Date:</label>
                                <input id="to" className="leaves-input" type="date" name="to" value={formData.to} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="leaves-form-group">
                            <label htmlFor="reason" className="leaves-label">Reason:</label>
                            <textarea id="reason" className="leaves-textarea" name="reason" value={formData.reason} onChange={handleChange} required />
                        </div>

                        <div className="leaves-form-actions">
                            <button className="leaves-submit-btn" type="submit">
                                {isEditing ? <span><FontAwesomeIcon icon={faEdit} /> Update Leave</span> : <span><FontAwesomeIcon icon={faPlus} /> Add Leave</span>}
                            </button>
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