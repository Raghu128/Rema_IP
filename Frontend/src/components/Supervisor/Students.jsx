import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../styles/Student/Student.css';

const Students = ({ id }) => {
  const [supervisorData, setSupervisorData] = useState(null);
  const [filteredSupervisorData, setFilteredSupervisorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
        const response = await axios.get(`/api/v1/supervisors/${id}`);
        const supervisors = response.data;
        const roleBasedStudents = {};

        await Promise.all(
          supervisors.map(async (supervisor) => {
            const student = await getUserName(supervisor.student_id);
            const { role, name } = student;
            if (!roleBasedStudents[role]) {
              roleBasedStudents[role] = [];
            }
            roleBasedStudents[role].push({
              id: supervisor.student_id,
              name,
              thesis_title: supervisor.thesis_title,
            });
          })
        );

        setSupervisorData(roleBasedStudents);
        setFilteredSupervisorData(roleBasedStudents);
      } catch (err) {
        setError("Error fetching project data from backend");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
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

  if (loading) return <div className="studentWithfaculty-loading">Loading...</div>;
  if (error) return <div className="studentWithfaculty-error">{error}</div>;

  return (
    <div className="studentWithfaculty-main-container">
      <h1 className="studentWithfaculty-heading">Students</h1>
      <button onClick={() => navigate('/update-supervisor')} className="studentWithfaculty-edit-button">Edit</button>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search student by name..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="studentWithfaculty-container">
        {filteredSupervisorData && Object.keys(filteredSupervisorData).length === 0 ? (
          <p className="studentWithfaculty-no-data">No students found</p>
        ) : (
          Object.keys(filteredSupervisorData).map((role) => (
            <div key={role} className="studentWithfaculty-role-section">
              <h2 className="studentWithfaculty-role">{role}</h2>

              {/* Table for displaying student details */}
              <table className="studentWithfaculty-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Project Title</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSupervisorData[role].map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.thesis_title}</td>
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
