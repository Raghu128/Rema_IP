import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit, faPlus, faMapMarkerAlt,
    faCalendarAlt, faUser, faCogs,
    faTable, faThLarge, faRupeeSign
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/Equipment/UserEquipmentList.css'

const UserEquipmentList = () => {
    const { user } = useSelector((state) => state.user);
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState('table');
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

    if (!user?.id) return <p className="equipment-message">Please log in to view your equipment.</p>;
    if (loading) return <Loader />;
    if (error) return <p className="equipment-message equipment-error">{error}</p>;

    return (
        <div className="equipment-container">
            <div className="equipment-header">
                <h2 className="equipment-title">
                    <FontAwesomeIcon icon={faCogs} className="equipment-title-icon" /> Your Equipment
                </h2>
                <div className="equipment-actions">
                    <button
                        onClick={() => setViewMode('card')}
                        className={`expenses-view-toggle ${viewMode === 'card' ? 'active' : ''}`}
                    >
                        <FontAwesomeIcon icon={faThLarge} /> Card
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`expenses-view-toggle ${viewMode === 'table' ? 'active' : ''}`}
                    >
                        <FontAwesomeIcon icon={faTable} /> Table
                    </button>
                    <button
                        onClick={() => navigate("/manage-equipment")}
                        className="expenses-manage-btn"
                    >
                        <FontAwesomeIcon icon={faEdit} /> Manage
                    </button>
                </div>
            </div>

            {equipment.length > 0 ? (
                viewMode === 'table' ? (
                    <div className="equipment-table-container">
                        <table className="equipment-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Location</th>
                                    <th>Added On</th>
                                    <th>User</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipment.map((item) => (
                                    <tr key={item._id} className="equipment-table-row">
                                        <td className="equipment-table-cell" data-label="Name">
                                            {item.name}
                                        </td>
                                        <td className="equipment-table-cell equipment-price" data-label="Price">
                                            <FontAwesomeIcon icon={faRupeeSign} />
                                            {parseFloat(item.amount.$numberDecimal).toFixed(2)}
                                        </td>
                                        <td className="equipment-table-cell equipment-location" data-label="Location">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} /> {item.location}
                                        </td>
                                        <td className="equipment-table-cell equipment-date" data-label="Added On">
                                            <FontAwesomeIcon icon={faCalendarAlt} /> {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="equipment-table-cell equipment-user" data-label="User">
                                            <FontAwesomeIcon icon={faUser} /> {item.usingUser._id === user?.id ? "You" : item.usingUser.name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="equipment-cards-container">
                        {equipment.map((item) => (
                            <div key={item._id} className="equipment-card">
                                <div className="equipment-card-header">
                                    <h3 className="equipment-name">{item.name}</h3>
                                    <div className="equipment-price">
                                        <FontAwesomeIcon icon={faRupeeSign} />
                                        {parseFloat(item.amount.$numberDecimal).toFixed(2)}
                                    </div>
                                </div>
                                <div className="equipment-card-body">
                                    <div className="equipment-detail">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="equipment-detail-icon" />
                                        <span>{item.location}</span>
                                    </div>
                                    <div className="equipment-detail">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="equipment-detail-icon" />
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="equipment-detail">
                                        <FontAwesomeIcon icon={faUser} className="equipment-detail-icon" />
                                        <span>{item.usingUser._id === user?.id ? "You" : item.usingUser.name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="equipment-empty-state">
                    <p className="equipment-message">No equipment found.</p>
                    <button
                        onClick={() => navigate("/manage-equipment")}
                        className="equipment-add-btn"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add New Equipment
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserEquipmentList;