import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/Equipment/UserEquipmentList.css"; 

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
        const response = await axios.get(
          `api/v1/equipment/${user.id}`
        );
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
    return <p>Please log in to view your equipment.</p>;
  }

  return (
    <div className="equipment-list-container">
      <h2>Your Equipment</h2>
      <button onClick={() => navigate('manage-equipment')}>Manage</button>
      
      {loading && <p className="loading">Loading equipment...</p>}
      {error && <p className="error">{error}</p>}
      
      {!loading && equipment.length === 0 && <p>No equipment found.</p>}

      <ul className="equipment-list">
        {equipment.map((item) => (
          <li key={item.id} className="equipment-item">
            <h3>{item.name}</h3>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Added On:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserEquipmentList;
