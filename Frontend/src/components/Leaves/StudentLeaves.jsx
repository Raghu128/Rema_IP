import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Leaves/StudentLeaves.css";
import Loader from "../Loader";
import { faEdit, faChalkboardTeacher} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router-dom";


const StudentLeaves = () => {
  const { user } = useSelector((state) => state.user);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  


  useEffect(() => {
    if (user?.id) {
      fetchLeaves(user.id);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchLeaves = async (userId) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="leaves-container">
      <div className="st-leaves-header">
        <h2 className="leaves-title">My Leaves</h2>
        <button className="manage-leave-btn" onClick={() => navigate(`/manage-leaves`)}>
          <FontAwesomeIcon icon={faEdit} /> Manage
        </button>
      </div>
      {loading ? (
        <p className="loading-message">Loading leaves...</p>
      ) : leaves.length === 0 ? (
        <p className="leaves-message">No leave records found.</p>
      ) : (
        <table className="leaves-table">
          <thead>
            <tr>
              <th>Faculty</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, index) => (
              <tr key={leave._id || `leave-${index}`}>
                <td> <FontAwesomeIcon icon={faChalkboardTeacher} /> {leave.faculty_id.name}</td>
                <td>{leave.from}</td>
                <td>{leave.to}</td>
                <td>{leave.reason}</td>
                <td className="student-leave">{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentLeaves;
