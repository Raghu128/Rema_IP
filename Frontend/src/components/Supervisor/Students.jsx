import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Student/Student.css";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faUserGraduate, faUserTie, faBookOpen, faFilter } from '@fortawesome/free-solid-svg-icons'; // Added faFilter

const Students = ({ id }) => {
    const [supervisorData, setSupervisorData] = useState(null);
    const [filteredSupervisorData, setFilteredSupervisorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("all"); // New state for role filter
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/v1/supervisors/${id}`);
                const supervisors = response.data;

                const roleBasedStudents = {};
                supervisors.forEach((supervisor) => {
                    const student = supervisor.student_id;
                    const role = student.role || "Unknown Role";
                    if (!roleBasedStudents[role]) {
                        roleBasedStudents[role] = {};
                    }
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
                        stipend: supervisor.stipend && supervisor.stipend.$numberDecimal
                            ? supervisor.stipend.$numberDecimal
                            : "0",
                    });
                });

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
            let filteredData = {};

            Object.keys(supervisorData).forEach((role) => {
                // Apply role filter first
                if (selectedRole === "all" || role === selectedRole) {
                    const filteredStudents = supervisorData[role].filter((student) =>
                        student.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    if (filteredStudents.length > 0) {
                        filteredData[role] = filteredStudents;
                    }
                }
            });
            setFilteredSupervisorData(filteredData);
        }
    }, [searchQuery, supervisorData, selectedRole]); // Add selectedRole to dependency array


    if (loading) return <Loader />;
    if (error) return <div className="student-error">{error}</div>;

    return (
        <div className="student-container">
            <div className="student-header">
                <h1 className="student-title">Students</h1>
                <button onClick={() => navigate("/update-supervisor")} className="student-edit-button">
                    <FontAwesomeIcon icon={faEdit} /> Manage
                </button>
            </div>

            <div className="student-search-container">
                <FontAwesomeIcon icon={faSearch} className="student-search-icon" />
                <input
                    type="text"
                    placeholder="Search students..."
                    className="student-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* Role Filter Select */}
                <select
                    className="student-role-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    {supervisorData && Object.keys(supervisorData).map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
                <FontAwesomeIcon icon={faFilter} className="student-filter-icon"/>
            </div>

            <div className="student-table-container">
                {filteredSupervisorData && Object.keys(filteredSupervisorData).length === 0 ? (
                    <p className="student-no-data">No students found</p>
                ) : (
                    Object.keys(filteredSupervisorData).map((role) => (
                        <div key={role} className="student-role-section">
                            <h2 className="student-role-title">
                                {role === "btech" && <span><FontAwesomeIcon icon={faUserGraduate} /> B.Tech Students</span>}
                                {role === "mtech" && <span><FontAwesomeIcon icon={faUserGraduate} /> M.Tech Students</span>}
                                {role === "phd" && <span><FontAwesomeIcon icon={faUserTie} /> PhD Scholars</span>}
                                {role === "faculty" && <span><FontAwesomeIcon icon={faUserTie} /> Faculty</span>}
                                {(!role || !["btech", "mtech", "phd", "faculty"].includes(role)) && <span><FontAwesomeIcon icon={faUserGraduate} /> {role}</span>}
                            </h2>
                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Projects</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSupervisorData[role].map((student) => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>
                                                <ul className="student-project-list">
                                                    {student.projects.map((proj, index) => (
                                                        <li key={index} className="student-project-item">
                                                            <span><FontAwesomeIcon icon={faBookOpen} size="sm" /> {proj.thesis_title}</span>
                                                            <span> (Stipend: {proj.stipend})</span>
                                                        </li>
                                                    ))}

                                                </ul>
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