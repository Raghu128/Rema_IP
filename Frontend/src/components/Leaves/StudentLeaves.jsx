import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Leaves/AddLeaveForm.css";

const StudentLeaves = () => {
  const { user } = useSelector((state) => state.user);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchLeaves(user.id);
    }
  }, [user]);

  const fetchLeaves = async (userId) => {
    try {
      const response = await axios.get(`/api/v1/leaves/${userId}`);
      const formattedLeaves = response.data.map((leave) => ({
        ...leave,
        from: leave.from.split("T")[0],
        to: leave.to.split("T")[0],
      }));
      setLeaves(formattedLeaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  return (
    <div className="leaves-form-container">
      <h2 className="leaves-title">My Leaves</h2>

      {leaves.length === 0 ? (
        <p className="leaves-message">No leave records found.</p>
      ) : (
        <ul className="leaves-list">
          {leaves.map((leave) => (
            <li key={leave._id} className="leaves-card">
              <span>
                {leave.from} to {leave.to} - {leave.reason}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentLeaves;
