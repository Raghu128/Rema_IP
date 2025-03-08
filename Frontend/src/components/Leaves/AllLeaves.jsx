import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Leaves/LeavesForFacultyPage.css";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCalendarAlt, faUserGraduate, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const LeavesForFacultyPage = () => {
    const { user } = useSelector((state) => state.user);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
            acc[studentId] = { name: leave.user?.name || "Unknown", leaves: [] };
        }
        acc[studentId].leaves.push(leave);
        return acc;
    }, {});

    const rows = [];
    Object.values(groupedLeaves).forEach((group) => {
        group.leaves.forEach((leave, index) => {
            rows.push(
                <tr key={leave._id}>
                    {index === 0 && (
                        <td rowSpan={group.leaves.length}><FontAwesomeIcon icon={faUserGraduate} /> {group.name}</td>
                    )}
                    <td><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(leave.from).toLocaleDateString()}</td>
                    <td><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(leave.to).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                </tr>
            );
        });
    });

    if (loading) return <Loader />;

    return (
        <div className="leaves-container">
            <div className="leaves-header">
                <h2 className="leaves-title">
                   <FontAwesomeIcon icon={faFileAlt} className="leaves-title-icon"/> All Leaves for Your Students
                </h2>
                <button className="manage-leave-btn" onClick={() => navigate(`/manage-leaves`)}>
                    <FontAwesomeIcon icon={faEdit} /> Manage
                </button>
            </div>
            {loading ? (
                <p className="leaves-loading">Loading leaves...</p>
            ) : error ? (
                <p className="leaves-error">{error}</p>
            ) : rows.length === 0 ? (
                <p className="leaves-no-data">No leaves found.</p>
            ) : (
                <table className="leaves-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            )}
        </div>
    );
};

export default LeavesForFacultyPage;