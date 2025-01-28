import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../styles/Student/Student.css'

const Students = ({ id }) => {
  const [supervisorData, setsupervisorData] = useState(null); // Store role-based students here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getUserName = async (userId) => {
    try {
      const response = await axios.get(`/api/v1/userbyid/${userId}`);
      return response.data[0];
    } catch (err) {
      console.error("Error fetching user name", err);
      return { name: "Unknown User", role: "Unknown Role" };
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);

        // Fetch supervisors (student IDs) from the backend
        const response = await axios.get(`/api/v1/supervisors/${id}`);
        const supervisors = response.data;

        // Fetch additional details for each supervisor and classify by role
        const roleBasedStudents = {};

        await Promise.all(
          supervisors.map(async (supervisor) => {
            const student = await getUserName(supervisor.student_id); // Fetch student details
            const { role, name } = student;

            // Add the student to the correct role category
            if (!roleBasedStudents[role]) {
              roleBasedStudents[role] = [];
            }

            // Push the student into the appropriate role category
            roleBasedStudents[role].push({
              id: supervisor.student_id,
              name,
              thesis_title: supervisor.thesis_title,
            });
          })
        );

        // Update state with the role-based classification
        setsupervisorData(roleBasedStudents);
      } catch (err) {
        setError("Error fetching project data from backend");
      } finally {
        setLoading(false); // Ensure loading is false even if there's an error
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="studentWithfaculty-loading">Loading...</div>;
  }

  if (error) {
    return <div className="studentWithfaculty-error">{error}</div>;
  }

  return (
    <div className="studentWithfaculty-container">
      <h1 className="studentWithfaculty-heading">Students</h1>
      <button onClick={() => navigate('/update-supervisor')} className="studentWithfaculty-edit-button">Edit</button>
      {supervisorData && Object.keys(supervisorData).length === 0 ? (
        <p className="studentWithfaculty-no-data">No students found</p>
      ) : (
        Object.keys(supervisorData).map((role) => (
          <div
            key={role}
            className="studentWithfaculty-role-section"
            style={{ marginBottom: "20px" }}
          >
            <h2 className="studentWithfaculty-role">{role}:</h2>
            <ul className="studentWithfaculty-list">
              {supervisorData[role].map((student) => (
                <li
                  key={role + student.thesis_title}
                  className="studentWithfaculty-list-item"
                >
                  <p className="studentWithfaculty-thesis">
                  <strong>Name :</strong> {student.name}
                  </p>
                  <p className="studentWithfaculty-thesis">
                    <strong>Project Title:</strong> {student.thesis_title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Students;
