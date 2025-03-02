import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import "../../styles/AddLeaveForm.css"; // Ensure you have appropriate CSS

const AddLeaveForm = () => {
  const { user } = useSelector((state) => state.user); // Logged-in faculty/supervisor
  const navigate = useNavigate();

  // Form state for a new leave record
  const [formData, setFormData] = useState({
    user: "",    // The selected student's ID
    from: "",
    to: "",
    reason: "",
  });

  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch students (exclude faculty and admin)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission to add a new leave
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post("/api/v1/leaves", formData);
      setMessage("Leave added successfully");
      setFormData({
        user: "",
        from: "",
        to: "",
        reason: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Failed to add leave");
    }
  };

  return (
    <div className="leave-form-container">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h2 className="leave-title">Add Leave</h2>
      {message && <p className="leave-message">{message}</p>}
      <form className="leave-form" onSubmit={handleSubmit}>
        <label>Student:</label>
        <select
          name="user"
          value={formData.user}
          onChange={handleChange}
          required
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} ({student.email})
            </option>
          ))}
        </select>

        <label>From Date:</label>
        <input
          type="date"
          name="from"
          value={formData.from}
          onChange={handleChange}
          required
        />

        <label>To Date:</label>
        <input
          type="date"
          name="to"
          value={formData.to}
          onChange={handleChange}
          required
        />

        <label>Reason:</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Leave</button>
      </form>
    </div>
  );
};

export default AddLeaveForm;
