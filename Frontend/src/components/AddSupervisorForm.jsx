import React, { useState, useEffect } from "react";
import axios from "axios";

const AddSupervisorForm = () => {
  const [formData, setFormData] = useState({
    faculty_id: "",
    student_id: "",
    joining: "",
    thesis_title: "",
    committee: "",
    stipend: "",
    funding_source: "",
    srpId: "",
  });

  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch users who are not faculty or admin
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("/api/v1/users");
        setStudents(response.data); // Assuming the response contains an array of students
      } catch (error) {
        console.error("Error fetching students:", error);
        setMessage("Failed to fetch students");
      }
    };

    fetchStudents();
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
  
    // Format committee as an array of ObjectIds (valid or empty array)
    const committeeArray = formData.committee.split(',').map(id => id.trim()).filter(id => id);
    
    // Ensure stipend is a number (or null if empty)
    const stipendValue = formData.stipend ? parseFloat(formData.stipend) : null;
    
    // Ensure srpId is either a valid ObjectId or null
    const srpIdValue = formData.srpId.trim() === "" ? null : formData.srpId;
  
    // Create new form data with corrected fields
    const updatedFormData = {
      ...formData,
      committee: committeeArray,
      stipend: stipendValue,
      srpId: srpIdValue,
    };
  
    try {
      const response = await axios.post("/api/v1/supervisors", updatedFormData);
      setMessage(`Supervisor added successfully: ${response.data.student_id}`);
      // Reset form
      setFormData({
        faculty_id: "",
        student_id: "",
        joining: "",
        thesis_title: "",
        committee: "",
        stipend: "",
        funding_source: "",
        srpId: "",
      });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to add supervisor");
    }
  };
  

  return (
    <div>
      <h2>Add Supervisor</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Faculty ID */}
        <div>
          <label htmlFor="faculty_id">Faculty ID:</label>
          <select
            id="faculty_id"
            name="faculty_id"
            value={formData.faculty_id}  // Use faculty_id for this select
            onChange={handleChange}
            required
          >
            <option value="">Select a Faculty</option>
            {students
              .filter((student) => student.role === "faculty") // Filter students for faculty
              .map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
          </select>
        </div>

        {/* Student ID (Dropdown to select student) */}
        <div>
          <label htmlFor="student_id">Student:</label>
          <select
            id="student_id"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a student</option>
            {students
              .filter((student) => student.role !== "faculty" && student.role !== "admin") // Filter out faculty and admin
              .map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
          </select>
        </div>

        {/* Joining Date */}
        <div>
          <label htmlFor="joining">Joining Date:</label>
          <input
            type="date"
            id="joining"
            name="joining"
            value={formData.joining}
            onChange={handleChange}
            required
          />
        </div>

        {/* Thesis Title */}
        <div>
          <label htmlFor="thesis_title">Thesis Title:</label>
          <input
            type="text"
            id="thesis_title"
            name="thesis_title"
            value={formData.thesis_title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Committee */}
        <div>
          <label htmlFor="committee">Committee (Faculty IDs):</label>
          <input
            type="text"
            id="committee"
            name="committee"
            value={formData.committee}
            onChange={handleChange}
            placeholder="Enter faculty IDs separated by commas"
          />
        </div>

        {/* Stipend */}
        <div>
          <label htmlFor="stipend">Stipend:</label>
          <input
            type="number"
            id="stipend"
            name="stipend"
            value={formData.stipend}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Funding Source */}
        <div>
          <label htmlFor="funding_source">Funding Source:</label>
          <input
            type="text"
            id="funding_source"
            name="funding_source"
            value={formData.funding_source}
            onChange={handleChange}
          />
        </div>

        {/* SRP ID */}
        <div>
          <label htmlFor="srpId">SRP ID:</label>
          <input
            type="text"
            id="srpId"
            name="srpId"
            value={formData.srpId}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Add Supervisor</button>
      </form>
    </div>
  );
};

export default AddSupervisorForm;
