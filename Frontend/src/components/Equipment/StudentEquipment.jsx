import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../styles/Equipment/UserEquipmentList.css";
import Loader from '../Loader';

const StudentEquipmentList = () => {
  const user = useSelector((state) => state.user?.user);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const fetchEquipment = async () => {
      try {
        const response = await axios.get(`/api/v1/equipment/used/${user.id}`);
        setEquipment(response.data.equipment || []);
      } catch (err) {
        setError("Failed to fetch equipment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [user?.id]);

  if (!user) {
    return <p className="equipment-list-message">Please log in to view your equipment.</p>;
  }

  if (loading) return <Loader />;

  return (
    <div className="equipment-list-container">
      <h2 className="equipment-list-title">Using Equipments</h2>

      {error && <p className="error">{error}</p>}
      {equipment.length === 0 ? (
        <p className="equipment-list-message">No equipment found.</p>
      ) : (
        <table className="equipment-table">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Location</th>
              <th>Added On</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item, index) => (
              <tr key={item.id || `equipment-${index}`}>
                <td>{item.ownership?.name || "N/A"}</td>
                <td>{item.name}</td>
                <td>₹{item.amount?.$numberDecimal ? parseFloat(item.amount.$numberDecimal).toFixed(2) : "0.00"}</td>
                <td>{item.location || "Unknown"}</td>
                <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
};

export default StudentEquipmentList;
