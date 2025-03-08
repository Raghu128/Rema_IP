import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/Equipment/UserEquipmentList.css";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faMapMarkerAlt, faCalendarAlt, faUser, faCogs } from '@fortawesome/free-solid-svg-icons';


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

    if (!user?.id) return <p className="equipment-list-message">Please log in to view your equipment.</p>;
    if (loading) return <Loader />;
    if (error) return <p className="equipment-list-message">{error}</p>;


    return (
        <div className="equipment-list-container">
            <div className="equipment-list-header">
                <h2 className="equipment-list-title">
                    <FontAwesomeIcon icon={faCogs} className="equipment-list-title-icon" /> Your Equipment
                </h2>
                <button onClick={() => navigate("/manage-equipment")} className="manage-equipment-btn">
                    <FontAwesomeIcon icon={faPlus} /> / <FontAwesomeIcon icon={faEdit} /> Manage
                </button>
            </div>


            {!loading && equipment.length > 0 ? (
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
                        {equipment.map((item) => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>₹{parseFloat(item.amount.$numberDecimal).toFixed(2)}</td>
                                <td><FontAwesomeIcon icon={faMapMarkerAlt} /> {item.location}</td>
                                <td><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(item.createdAt).toLocaleDateString()}</td>
                                <td><FontAwesomeIcon icon={faUser} /> {item.usingUser.name}</td>
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

export default UserEquipmentList;