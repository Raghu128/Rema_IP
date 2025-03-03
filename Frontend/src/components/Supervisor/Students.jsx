import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Student/Student.css";
import Loader from '../Loader';

const Students = ({ id }) => {
  const [supervisorData, setSupervisorData] = useState(null);
  const [filteredSupervisorData, setFilteredSupervisorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/supervisors/${id}`);
        const supervisors = response.data;
        
        // Group by student's role then by student id
        const roleBasedStudents = {};
        supervisors.forEach((supervisor) => {
          // student_id is already populated with name and role
          const student = supervisor.student_id;
          const role = student.role || "Unknown Role";
          if (!roleBasedStudents[role]) {
            roleBasedStudents[role] = {};
          }
          // If student already exists, append project; otherwise, create new record.
          if (!roleBasedStudents[role][student._id]) {
            roleBasedStudents[role][student._id] = {
              id: student._id,
              name: student.name,
              role: student.role,
              projects: [],
            };
          }
          roleBasedStudents[role][student._id].projects.push({
            thesis_title: supervisor.thesis_title,
            stipend:
              supervisor.stipend && supervisor.stipend.$numberDecimal
                ? supervisor.stipend.$numberDecimal
                : "0",
          });
        });

        // Convert each role's object to an array
        const roleBasedStudentsArray = {};
        Object.keys(roleBasedStudents).forEach((role) => {
          roleBasedStudentsArray[role] = Object.values(roleBasedStudents[role]);
        });

        setSupervisorData(roleBasedStudentsArray);
        setFilteredSupervisorData(roleBasedStudentsArray);
      } catch (err) {
        console.error("Error fetching supervisors:", err);
        setError("Error fetching supervisor data from backend");
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, [id]);

  useEffect(() => {
    if (supervisorData) {
      const filteredData = {};
      Object.keys(supervisorData).forEach((role) => {
        const filteredStudents = supervisorData[role].filter((student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredStudents.length > 0) {
          filteredData[role] = filteredStudents;
        }
      });
      setFilteredSupervisorData(filteredData);
    }
  }, [searchQuery, supervisorData]);

  if (loading)
    return  <Loader/>;
  if (error)
    return <div className="studentWithfaculty-error">{error}</div>;

  return (
    <div className="studentWithfaculty-main-container">
      <div className="studentWithfaculty-header">
        <h1 className="studentWithfaculty-heading">Students</h1>
        <button
          onClick={() => navigate("/update-supervisor")}
          className="studentWithfaculty-edit-button"
        >
          Edit
        </button>
      </div>

      <input
        type="text"
        placeholder="Search student by name..."
        className="student-search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="studentWithfaculty-container">
        {filteredSupervisorData &&
        Object.keys(filteredSupervisorData).length === 0 ? (
          <p className="studentWithfaculty-no-data">No students found</p>
        ) : (
          Object.keys(filteredSupervisorData).map((role) => (
            <div key={role} className="studentWithfaculty-role-section">
              <h2 className="studentWithfaculty-role">{role}</h2>
              <table className="studentWithfaculty-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Project Info</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSupervisorData[role].map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td className="role-cell">{student.role}</td>
                      <td>
                        {student.projects.map((proj, index) => (
                          <div key={index} className="project-info-item">
                            <span className="project-thesis">
                              Thesis: {proj.thesis_title}
                            </span>
                            <span className="project-stipend">
                              Stipend: {proj.stipend}
                            </span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Students;
