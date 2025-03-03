import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/Leaves/LeavesForFacultyPage.css"; // Import the CSS file
import Loader from '../Loader'

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
        // Fetch leaves for students supervised by the current faculty
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

  // Group leaves by student ID so that the student name appears only once
  const groupedLeaves = leaves.reduce((acc, leave) => {
    const studentId = leave.user?._id || "unknown";
    if (!acc[studentId]) {
      acc[studentId] = { name: leave.user?.name || "Unknown", leaves: [] };
    }
    acc[studentId].leaves.push(leave);
    return acc;
  }, {});

  // Build table rows with grouped data
  const rows = [];
  Object.values(groupedLeaves).forEach((group) => {
    group.leaves.forEach((leave, index) => {
      rows.push(
        <tr key={leave._id}>
          {index === 0 && (
            <td rowSpan={group.leaves.length}>{group.name}</td>
          )}
          <td>{new Date(leave.from).toLocaleDateString()}</td>
          <td>{new Date(leave.to).toLocaleDateString()}</td>
          <td>{leave.reason}</td>
        </tr>
      );
    });
  });

  if(loading) return <Loader/>;

  return (
    <div className="leaves-container">
      <button className="manage-leave-btn" onClick={() => navigate(`/manage-leaves`)}>
        ✏️
      </button>
      <h2>All Leaves for Your Students</h2>

      {loading ? (
        <p className="loading-message">Loading leaves...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : rows.length === 0 ? (
        <p>No leaves found.</p>
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
