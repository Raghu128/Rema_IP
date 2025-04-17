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

    if (user?.id) {
      fetchLeaves();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Get initials from a name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="currentUserLeave-loading currentUserLeave-fadeIn">
        Loading leave data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="currentUserLeave-error currentUserLeave-fadeIn">
        {error}
      </div>
    );
  }

  if (!leaves || leaves.length === 0) {
    return<></>;
    return (
      <div className="currentUserLeave-empty currentUserLeave-fadeIn">
        No users on leave this month
      </div>
    );
  }

  return (
    <div className="currentUserLeave-container currentUserLeave-fadeIn">
      <div className="currentUserLeave-header">
        
        
        <div className="currentUserLeave-summary">
          <span>Current Month Leave Summary</span>
          <span>Total: <span className="currentUserLeave-count">{leaves.length}</span></span>
        </div>
      </div>

      <div className="currentUserLeave-scrollable">
        <ul className="currentUserLeave-list">
          {leaves.map(leave => (
            <li key={leave.leave_id} className="currentUserLeave-item">
              <div className="currentUserLeave-user">
                <div className="currentUserLeave-avatar">
                  {getInitials(leave.user.name)}
                </div>
                <div className="currentUserLeave-userInfo">
                  <span className="currentUserLeave-name">{leave.user.name}</span>
                  <span className="currentUserLeave-email">{leave.user.email}</span>
                </div>
              </div>
              
              <div className="currentUserLeave-details">
                <div className="currentUserLeave-dateBox">
                  <span className="currentUserLeave-dateLabel">Leave Period</span>
                  <div className="currentUserLeave-dates">
                    <span className="currentUserLeave-from">
                      {formatDate(leave.from)}
                    </span>
                    <span className="currentUserLeave-arrow">→</span>
                    <span className="currentUserLeave-to">
                      {formatDate(leave.to)}
                    </span>
                    <span className="currentUserLeave-days">
                      {leave.days} days
                    </span>
                  </div>
                </div>
                
                <div className="currentUserLeave-reasonBox">
                  <span className="currentUserLeave-reasonLabel">Reason</span>
                  <div className="currentUserLeave-reason">
                    <span className="currentUserLeave-reasonText">{leave.reason}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CurrentUserLeaveList;