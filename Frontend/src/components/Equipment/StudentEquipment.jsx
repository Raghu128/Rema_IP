import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../styles/Equipment/UserEquipmentList.css"; 

const StudentEquipmentList = () => {
  const { user } = useSelector((state) => state.user);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchEquipment = async () => {
      try {
        const response = await axios.get(`api/v1/equipment/used/${user.id}`);
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

  return (
    <div className="equipment-list-container">
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
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>₹{parseFloat(item.amount.$numberDecimal).toFixed(2)}</td>
                <td>{item.location}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentEquipmentList;
