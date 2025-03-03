import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Leaves/AddLeaveForm.css";

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

  return (
    <div className="leaves-form-container">
      <button className="leaves-back-button" onClick={() => navigate(-1)}>Go Back</button>
      <h2 className="leaves-title">Manage Leaves</h2>

      <label className="leaves-label">Select Student:</label>
      <select className="leaves-select" value={selectedStudent} onChange={handleStudentChange} required>
        <option value="">Select a student</option>
        {students.map((student) => (
          <option key={student._id} value={student._id}>
            {student.name} ({student.email})
          </option>
        ))}
      </select>

      {selectedStudent && (
        <>
          <h3 className="leaves-subtitle">Existing Leaves</h3>
          {leaves.length === 0 ? (
            <p className="leaves-message">No leave records found.</p>
          ) : (
            <ul className="leaves-list">
              {leaves.map((leave) => (
                <li key={leave._id} className="leaves-card">
                  <span>
                    {leave.from} to {leave.to} - {leave.reason}
                  </span>
                  <button className="leaves-edit-button" onClick={() => handleEdit(leave)}>Edit</button>
                </li>
              ))}
            </ul>
          )}

          <h3 className="leaves-subtitle">{isEditing ? "Edit Leave" : "Add New Leave"}</h3>
          {message && <p className="leaves-message">{message}</p>}

          <form className="leaves-form" onSubmit={handleSubmit}>
            <label className="leaves-label">From Date:</label>
            <input className="leaves-input" type="date" name="from" value={formData.from} onChange={handleChange} required />

            <label className="leaves-label">To Date:</label>
            <input className="leaves-input" type="date" name="to" value={formData.to} onChange={handleChange}  />

            <label className="leaves-label">Reason:</label>
            <textarea className="leaves-textarea" name="reason" value={formData.reason} onChange={handleChange} required />

            <button className="leaves-submit-button" type="submit">{isEditing ? "Update Leave" : "Add Leave"}</button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddLeaveForm;