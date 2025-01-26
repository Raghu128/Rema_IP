import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import '../styles/AddSupervisorForm.css';

const AddSupervisorForm = () => {
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    faculty_id: "",
    student_id: "",
    joining: "",
    thesis_title: "",
    committee: [], // Store committee as an array
    stipend: "",
    funding_source: "",
    srpId: null, // Store SRP ID as string
  });

  const [students, setStudents] = useState([]);
  const [supervisors, setsupervisors] = useState([]); // State to store all sponsor projects
  const [message, setMessage] = useState("");

  // Fetch users who are not faculty or admin
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/user");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (user?.id) {
      setFormData((prevData) => ({
        ...prevData,
        faculty_id: user.id, // Automatically set the faculty_id
      }));
    }
  }, [user]);

  // Fetch all sponsor projects when component mounts
  useEffect(() => {
    const fetchsupervisors = async () => {
      if (!user?.id) return; // Check if user.id is defined before running the code
      try {
        const response = await axios.get(`/api/v1/sponsor-projects/${user.id}`);
        setsupervisors(response.data);
      } catch (error) {
        console.error("Error fetching sponsor projects:", error);
        setMessage("Failed to fetch sponsor projects");
      }
    };

    fetchsupervisors();
  }, [user]); // Add `user` as a dependency to re-run when it changes

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "committee") {
        // Toggle faculty checkbox for committee
        setFormData({
          ...formData,
          committee: checked
            ? [...formData.committee, value]
            : formData.committee.filter((id) => id !== value),
        });
      } else {
        // Toggle spid checkbox
        setFormData({
          ...formData,
          [name]: checked ? value : "",
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const stipendValue = formData.stipend ? parseFloat(formData.stipend) : 0;

    try {
      const updatedFormData = {
        ...formData,
        stipend: stipendValue,
      };

      const response = await axios.post("/api/v1/supervisors", updatedFormData);
      setMessage(`Supervisor added successfully: ${response.data.student_id}`);
      setFormData({
        faculty_id: "",
        student_id: "",
        joining: "",
        thesis_title: "",
        committee: [],
        stipend: "",
        funding_source: "",
        srpId: null,
      });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to add supervisor");
    }
  };

  return (
    <div className="supervisor-form-container">
      <h2 className="supervisor-title">Add Supervisor</h2>
      {message && <p className="supervisor-message">{message}</p>}
      <form className="supervisor-form" onSubmit={handleSubmit}>
        <div className="supervisor-field">
          <label htmlFor="student_id" className="supervisor-label">Student:</label>
          <select
            id="student_id"
            name="student_id"
            value={formData.student_id || ""} // Prevent null value
            onChange={handleChange}
            required
            className="supervisor-select"
          >
            <option value="">Select a student</option>
            {students
              .filter((student) => student.role !== "faculty" && student.role !== "admin")
              .map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
          </select>
        </div>

        <div className="supervisor-field">
          <label htmlFor="joining" className="supervisor-label">Joining Date:</label>
          <input
            type="date"
            id="joining"
            name="joining"
            value={formData.joining}
            onChange={handleChange}
            required
            className="supervisor-input"
          />
        </div>

        <div className="supervisor-field">
          <label htmlFor="thesis_title" className="supervisor-label">Thesis Title:</label>
          <input
            type="text"
            id="thesis_title"
            name="thesis_title"
            value={formData.thesis_title}
            onChange={handleChange}
            required
            className="supervisor-input"
          />
        </div>

        <div className="supervisor-field">
          <label className="supervisor-label">Committee (Faculty):</label>
          {students
            .filter((student) => student.role === "faculty" && student._id === user.id)
            .map((faculty) => (
              <div key={faculty._id} className="supervisor-checkbox-item">
                <input
                  type="checkbox"
                  id={`committee-${faculty._id}`}
                  name="committee"
                  value={faculty._id}
                  checked={formData.committee.includes(faculty._id)}
                  onChange={handleChange}
                  className="supervisor-checkbox"
                />
                <label htmlFor={`committee-${faculty._id}`} className="supervisor-checkbox-label">
                  {faculty.name} ({faculty.email})
                </label>
              </div>
            ))}
        </div>

        <div className="supervisor-field">
          <label htmlFor="stipend" className="supervisor-label">Stipend:</label>
          <input
            type="number"
            id="stipend"
            name="stipend"
            value={formData.stipend}
            onChange={handleChange}
            min="0"
            className="supervisor-input"
          />
        </div>

        <div className="supervisor-field">
          <label htmlFor="funding_source" className="supervisor-label">Funding Source:</label>
          <input
            type="text"
            id="funding_source"
            name="funding_source"
            value={formData.funding_source}
            onChange={handleChange}
            className="supervisor-input"
          />
        </div>

        <div className="supervisor-field">
          <label htmlFor="srpId" className="supervisor-label">Select SRP ID:</label>
          <select
            id="srpId"
            name="srpId"
            value={formData.srpId || ""} // Prevent null value
            onChange={handleChange}
            className="supervisor-select"
          >
            <option value="">Select a Sponsor Project</option>
            {supervisors.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title} ({project.agency})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="supervisor-button">Add Supervisor</button>
      </form>
    </div>
  );
};

export default AddSupervisorForm;
