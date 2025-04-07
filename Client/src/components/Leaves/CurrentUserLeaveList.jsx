import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../../styles/Leaves/CurrentUserLeaveList.css';

const CurrentUserLeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.user);
  

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/leaves/currentMonth/${user.id}`);
        setLeaves(response.data.users);
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leave data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [user]);

  if (loading) {
    return <div className="currentUserLeave-loading">Loading leave data...</div>;
  }

  if (error) {
    return <div className="currentUserLeave-error">{error}</div>;
  }

  if (leaves.length === 0) {
    return <div className="currentUserLeave-empty">No users on leave this month</div>;
  }

  return (
    <div className="currentUserLeave-container">
      <h3 className="currentUserLeave-title">Users on Leave This Month</h3>
      
      <div className="currentUserLeave-summary">
        Total Users on Leave: <span className="currentUserLeave-count">{leaves.length}</span>
      </div>

      <ul className="currentUserLeave-list">
        {leaves.map(leave => (
          <li key={leave.leave_id} className="currentUserLeave-item">
            <div className="currentUserLeave-user">
              <span className="currentUserLeave-name">{leave.user.name}</span>
              <span className="currentUserLeave-email">{leave.user.email}</span>
            </div>
            
            <div className="currentUserLeave-dates">
              <span className="currentUserLeave-from">
                {new Date(leave.from).toLocaleDateString()}
              </span>
              {' → '}
              <span className="currentUserLeave-to">
                {new Date(leave.to).toLocaleDateString()}
              </span>
              <span className="currentUserLeave-days">({leave.days} days)</span>
            </div>
            
            <div className="currentUserLeave-reason">
              Reason: <span className="currentUserLeave-reasonText">{leave.reason}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrentUserLeaveList;