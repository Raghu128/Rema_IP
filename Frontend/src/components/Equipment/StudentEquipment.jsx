import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit, faPlus, faMapMarkerAlt,
    faCalendarAlt, faUser, faTools,
    faTable, faThLarge, faRupeeSign
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/Equipment/UserEquipmentList.css'


const StudentEquipmentList = () => {
    const { user } = useSelector((state) => state.user);
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.id) return;

        const fetchEquipment = async () => {
            try {
                setLoading(true);
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

    if (!user?.id) return <p className="equipment-message">Please log in to view your equipment.</p>;
    if (loading) return <Loader />;
    if (error) return <p className="equipment-message equipment-error">{error}</p>;

    return (
        <div className="equipment-container">
            <div className="equipment-header">
                <h2 className="equipment-title">
                    <FontAwesomeIcon icon={faTools} className="equipment-title-icon" /> Using Equipment
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
                </div>
            </div>

            {equipment.length > 0 ? (
                viewMode === 'table' ? (
                    <div className="equipment-table-container">
                        <table className="equipment-table">
                            <thead>
                                <tr>
                                    <th>Owner</th>
                                    <th>Name</th>
                                    <th>Added On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipment.map((item) => (
                                    <tr key={item._id} className="equipment-table-row">
                                        <td className="equipment-table-cell" data-label="Owner">
                                            <FontAwesomeIcon icon={faUser} /> {item.ownership?.name || "N/A"}
                                        </td>
                                        <td className="equipment-table-cell" data-label="Name">
                                            {item.name}
                                        </td>
                                        <td className="equipment-table-cell equipment-date" data-label="Added On">
                                            <FontAwesomeIcon icon={faCalendarAlt} /> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
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
                                </div>
                                <div className="equipment-card-body">
                                    <div className="equipment-detail">
                                        <FontAwesomeIcon icon={faUser} className="equipment-detail-icon" />
                                        <span>Owner: {item.ownership?.name || "N/A"}</span>
                                    </div>
                                    <div className="equipment-detail">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="equipment-detail-icon" />
                                        <span>Added: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="equipment-empty-state">
                    <p className="equipment-message">No equipment found.</p>
                </div>
            )}
        </div>
    );
};

export default StudentEquipmentList;