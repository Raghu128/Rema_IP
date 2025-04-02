import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, faPlus, faMapMarkerAlt,
  faCalendarAlt, faUser, faCogs,
  faTable, faThLarge, faRupeeSign,
  faBoxOpen, faTools, faSearch
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/Equipment/UserEquipmentList.css';

const UserEquipmentList = () => {
    const { user } = useSelector((state) => state.user);
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState('table');
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchEquipment = async () => {
            try {
                setLoading(true);
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

    const filteredEquipment = equipment.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.usingUser.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user?.id) return <p className="equipment-message">Please log in to view your equipment.</p>;
    if (loading) return <Loader />;
    if (error) return <p className="equipment-message equipment-error">{error}</p>;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="equipment-container">
            <div className="equipment-header">
                <div className="equipment-header-left">
                    <h1 className="equipment-title">
                        <FontAwesomeIcon icon={faTools} className="equipment-title-icon" /> 
                        Equipment Inventory
                    </h1>
                    <div className="equipment-stats">
                        <div className="equipment-stat-card">
                            <FontAwesomeIcon icon={faBoxOpen} className="equipment-stat-icon" />
                            <div className="equipment-stat-content">
                                <span className="equipment-stat-number">{equipment.length}</span>
                                <span className="equipment-stat-label">Total Items</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="equipment-actions">
                    <div className="equipment-view-toggle-group">
                        <button 
                            className={`equipment-view-toggle ${viewMode === 'card' ? 'equipment-active' : ''}`}
                            onClick={() => setViewMode('card')}
                        >
                            <FontAwesomeIcon icon={faThLarge} /> Cards
                        </button>
                        <button 
                            className={`equipment-view-toggle ${viewMode === 'table' ? 'equipment-active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            <FontAwesomeIcon icon={faTable} /> Table
                        </button>
                    </div>
                    <button 
                        className="equipment-manage-button"
                        onClick={() => navigate("/manage-equipment")}
                    >
                        <FontAwesomeIcon icon={faEdit} /> Manage
                    </button>
                </div>
            </div>

            <div className="equipment-controls">
                <div className="equipment-search-container">
                    <FontAwesomeIcon icon={faSearch} className="equipment-search-icon" />
                    <input
                        type="text"
                        placeholder="Search equipment by name, location or user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="equipment-search-input"
                    />
                </div>
            </div>

            {filteredEquipment.length > 0 ? (
                viewMode === 'table' ? (
                    <div className="equipment-table-container">
                        <table className="equipment-table">
                            <thead>
                                <tr>
                                    <th>Equipment Name</th>
                                    <th>Funded By</th>
                                    <th>Value</th>
                                    <th>Location</th>
                                    <th>Added On</th>
                                    <th>Assigned To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEquipment.map((item) => (
                                    <tr key={item._id} className="equipment-table-row">
                                        <td className="equipment-table-name">
                                            {item.name}
                                        </td>
                                        <td className="equipment-table-name">
                                            {item.funding_by_srp_id ? item.funding_by_srp_id?.agency : "self"}
                                        </td>
                                        <td className="equipment-table-name">
                                            {/* <FontAwesomeIcon icon={faRupeeSign} /> */}
                                            {formatCurrency(parseFloat(item.amount.$numberDecimal))}
                                        </td>
                                        <td className="equipment-table-name">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                            <span>{item.location}</span>
                                        </td>
                                        <td className="equipment-table-name">
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="equipment-table-name">
                                            <FontAwesomeIcon icon={faUser} />
                                            <span>{item.usingUser._id === user?.id ? "You" : item.usingUser.name}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="equipment-cards-grid">
                        {filteredEquipment.map((item) => (
                            <div key={item._id} className="equipment-card">
                                <div className="equipment-card-header">
                                    <h3 className="equipment-card-title">{item.name}</h3>
                                    <div className="equipment-card-price">
                                        <FontAwesomeIcon icon={faRupeeSign} />
                                        {formatCurrency(parseFloat(item.amount.$numberDecimal))}
                                    </div>
                                </div>
                                <div className="equipment-card-body">
                                    <div className="equipment-card-detail">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="equipment-card-icon" />
                                        <div className="equipment-card-detail-content">
                                            <span className="equipment-card-label">Location</span>
                                            <span className="equipment-card-location">{item.location}</span>
                                        </div>
                                    </div>
                                    <div className="equipment-card-detail">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="equipment-card-icon" />
                                        <div className="equipment-card-detail-content">
                                            <span className="equipment-card-label">Added On</span>
                                            <span className="equipment-card-date">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="equipment-card-detail">
                                        <FontAwesomeIcon icon={faUser} className="equipment-card-icon" />
                                        <div className="equipment-card-detail-content">
                                            <span className="equipment-card-label">Assigned To</span>
                                            <span className="equipment-card-user">
                                                {item.usingUser._id === user?.id ? "You" : item.usingUser.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="equipment-empty-state">
                    <div className="equipment-empty-content">
                        <FontAwesomeIcon icon={faBoxOpen} className="equipment-empty-icon" />
                        <h3>No Equipment Found</h3>
                        <p>Try adjusting your search or add new equipment</p>
                        <button
                            className="equipment-add-button"
                            onClick={() => navigate("/manage-equipment")}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Equipment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserEquipmentList;