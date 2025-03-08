import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Equipment/UserEquipmentList.css";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faMapMarkerAlt, faCalendarAlt, faUser, faCogs, faTools } from '@fortawesome/free-solid-svg-icons'; // Import faTools


const StudentEquipmentList = () => {
    const user = useSelector((state) => state.user?.user); // Access user directly
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.id) return;

        const fetchEquipment = async () => {
            try {
                const response = await axios.get(`/api/v1/equipment/used/${user.id}`);
                setEquipment(response.data.equipment || []); // Default to empty array if null
            } catch (err) {
                setError("Failed to fetch equipment. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [user?.id]); // Correct dependency

    if (!user?.id) return <p className="equipment-list-message">Please log in to view your equipment.</p>;
    if (loading) return <Loader />;
    if (error) return <p className="equipment-list-message">{error}</p>;

    return (
        <div className="equipment-list-container">
            <div className="equipment-list-header">
                <h2 className="equipment-list-title">
                    {/* Use faTools for a more appropriate icon */}
                    <FontAwesomeIcon icon={faTools} className="equipment-list-title-icon" /> Using Equipments
                </h2>
            </div>
            {!loading && equipment.length > 0 ? (
                <table className="equipment-table">
                    <thead>
                        <tr>
                            <th>Owner</th>
                            <th>Name</th>
                            {/* <th>Price (₹)</th>
                            <th>Location</th> */}
                            <th>Added On</th>

                        </tr>
                    </thead>
                    <tbody>
                        {equipment.map((item) => (
                            <tr key={item._id}>
                                <td>{item.ownership?.name || "N/A"}</td>
                                <td>{item.name}</td>
                                {/* <td>₹{item.amount?.$numberDecimal ? parseFloat(item.amount.$numberDecimal).toFixed(2) : "0.00"}</td>
                                 <td><FontAwesomeIcon icon={faMapMarkerAlt} /> {item.location || "Unknown"}</td> */}
                                <td><FontAwesomeIcon icon={faCalendarAlt} /> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="equipment-list-message">No equipment found.</p>
            )}
        </div>
    );
};

export default StudentEquipmentList;