import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/Equipment/UserEquipmentList.css"; 
import Loader from '../Loader'

const UserEquipmentList = () => {
  const { user } = useSelector((state) => state.user);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!user) return;

    const fetchEquipment = async () => {
      try {
        const response = await axios.get(`api/v1/equipment/${user.id}`);
        setEquipment(response.data.equipment);
      } catch (err) {
        setError("Failed to fetch equipment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [user]);

  if (!user) {
    return <p className="equipment-list-message">Please log in to view your equipment.</p>;
  }
  if(loading) return <Loader/>;

  return (
    <div className="equipment-list-container">
      <button onClick={() => navigate("/manage-equipment")} className="manage-equipment-btn">
        Manage
      </button>

      <h2 className="equipment-list-title">Your Equipment</h2>

      {loading && <p className="loading">Loading equipment...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && equipment.length === 0 && <p className="equipment-list-message">No equipment found.</p>}

      {!loading && equipment.length > 0 && (
        <table className="equipment-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Location</th>
              <th>Added On</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item, index) => (
              <tr key={item.id || `equipment-${index}`}>
                <td>{item.name}</td>
                <td>₹{parseFloat(item.amount.$numberDecimal).toFixed(2)}</td>
                <td>{item.location}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>{item.usingUser.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserEquipmentList;
