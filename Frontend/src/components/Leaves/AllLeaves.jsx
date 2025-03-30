import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Leaves/LeavesForFacultyPage.css";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUserGraduate, 
  faFileAlt,
  faTable,
  faThLarge,
  faClock,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

const LeavesForFacultyPage = () => {
    const { user } = useSelector((state) => state.user);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchLeaves = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/v1/leaves/faculty/${user?.id}`);                
                setLeaves(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch leaves.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchLeaves();
        } else {
            setLoading(false);
        }
    }, [user]);

    const groupedLeaves = leaves.reduce((acc, leave) => {
        const studentId = leave.user?._id || "unknown";
        if (!acc[studentId]) {
            acc[studentId] = { 
                name: leave.user?.name || "Unknown", 
                email: leave.user?.email || "",
                leaves: [] 
            };
        }
        acc[studentId].leaves.push(leave);
        return acc;
    }, {});

    // Filter students based on search term
    const filteredGroupedLeaves = Object.entries(groupedLeaves).filter(([_, group]) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            group.name.toLowerCase().includes(searchLower) ||
            group.email.toLowerCase().includes(searchLower)
        );
    });

    const toggleStudentExpand = (studentId) => {
        setExpandedStudent(expandedStudent === studentId ? null : studentId);
    };

    const calculateLeaveDays = (from, to) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const diffTime = Math.abs(toDate - fromDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    };

    if (loading) return <Loader />;
    if (!user?.id) return <p className="leaves-message">Please log in to view leaves.</p>;
    if (error) return <p className="leaves-message leaves-error">{error}</p>;

    return (
        <div className="leaves-container">
            <div className="leaves-header">
                <h2 className="leaves-title">
                   <FontAwesomeIcon icon={faFileAlt} className="leaves-title-icon"/> All Leaves for Your Students
                </h2>
                <div className="leaves-controls">
                    <div className="search-container">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search students by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="leaves-view-toggle">
                    <button
                                            onClick={() => setViewMode('card')}
                                            className={`expenses-view-toggle ${viewMode === 'card' ? 'active' : ''}`}
                                        >
                                            <FontAwesomeIcon icon={faThLarge} /> Card
                                        </button>
                                        <button
                                            onClick={() => setViewMode('table')}
                                            className={`expenses-view-toggle ${viewMode === 'table' ? 'active' : ''}`}
                                        >
                                            <FontAwesomeIcon icon={faTable} /> Table
                                        </button>
                    </div>
                </div>
            </div>

            {filteredGroupedLeaves.length === 0 ? (
                <div className="leaves-empty-state">
                    <p className="leaves-message">
                        {searchTerm ? "No matching students found." : "No leaves found for your students."}
                    </p>
                </div>
            ) : viewMode === 'table' ? (
                <div className="leaves-table-container">
                    <table className="leaves-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Leave Period</th>
                                <th>Duration</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGroupedLeaves.map(([studentId, group]) => (
                                group.leaves.map((leave, index) => (
                                    <tr key={leave._id}>
                                        {index === 0 && (
                                            <td rowSpan={group.leaves.length} className="student-cell">
                                                <div className="student-info">
                                                    <FontAwesomeIcon icon={faUserGraduate} />
                                                    <div>
                                                        <div className="student-name">{group.name}</div>
                                                        <div className="student-email">{group.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        <td>
                                            <div className="leave-dates">
                                                <span><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(leave.from).toLocaleDateString()}</span>
                                                <span className="date-separator">to</span>
                                                <span><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(leave.to).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="leave-duration">
                                                <FontAwesomeIcon icon={faClock} />
                                                {calculateLeaveDays(leave.from, leave.to)} days
                                            </div>
                                        </td>
                                        <td className="leave-reason">{leave.reason}</td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="leaves-cards-container">
                    {filteredGroupedLeaves.map(([studentId, group]) => (
                        <div key={studentId} className="student-leave-card">
                            <div 
                                className="student-card-header" 
                                onClick={() => toggleStudentExpand(studentId)}
                            >
                                <div className="student-info">
                                    <div className="student-avatar">
                                        <FontAwesomeIcon icon={faUserGraduate} />
                                    </div>
                                    <div>
                                        <h3 className="student-name">{group.name}</h3>
                                        <p className="student-email">{group.email}</p>
                                        <div className="leave-count">
                                            {group.leaves.length} leave{group.leaves.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className={`expand-icon ${expandedStudent === studentId ? 'expanded' : ''}`}>
                                    ▼
                                </div>
                            </div>
                            
                            {expandedStudent === studentId && (
                                <div className="leave-details">
                                    {group.leaves.map(leave => (
                                        <div key={leave._id} className="leave-item">
                                            <div className="leave-dates">
                                                <span><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(leave.from).toLocaleDateString()}</span>
                                                <span className="date-separator">to</span>
                                                <span><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(leave.to).toLocaleDateString()}</span>
                                            </div>
                                            <div className="leave-meta">
                                                <span className="leave-duration">
                                                    <FontAwesomeIcon icon={faClock} />
                                                    {calculateLeaveDays(leave.from, leave.to)} days
                                                </span>
                                            </div>
                                            <div className="leave-reason">{leave.reason}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeavesForFacultyPage;