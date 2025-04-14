import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';
import { 
  Package, Wrench, MapPin, Calendar, User, 
  Settings, Table, Grid, IndianRupee, Search, Plus 
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
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
                        <Wrench className="equipment-title-icon" size={30} /> 
                        Equipment Inventory
                    </h1>
                    <div className="equipment-stats">
                        <div className="equipment-stat-card">
                            <div className="equipment-stat-icon-wrapper">
                                <Package className="equipment-stat-icon" size={20} />
                            </div>
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
                            aria-label="Card View"
                        >
                            <Grid size={18} /> Cards
                        </button>
                        <button 
                            className={`equipment-view-toggle ${viewMode === 'table' ? 'equipment-active' : ''}`}
                            onClick={() => setViewMode('table')}
                            aria-label="Table View"
                        >
                            <Table size={18} /> Table
                        </button>
                    </div>
                    <button 
                        className="equipment-manage-button"
                        onClick={() => navigate("/manage-equipment")}
                        aria-label="Manage Equipment"
                    >
                        <FontAwesomeIcon icon={faEdit} /> Manage
                    </button>
                </div>
            </div>

            <div className="equipment-controls">
                <div className="equipment-search-container">
                    <Search className="equipment-search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search equipment by name, location or user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="equipment-search-input"
                        aria-label="Search equipment"
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
                                        <td className="equipment-table-value">
                                            <div className="equipment-table-price">
                                                <IndianRupee size={14} />
                                                <span>{formatCurrency(parseFloat(item.amount.$numberDecimal))}</span>
                                            </div>
                                        </td>
                                        <td className="equipment-table-location">
                                            <div className="equipment-table-icon-content">
                                                <MapPin size={16} className="equipment-table-icon" />
                                                <span>{item.location}</span>
                                            </div>
                                        </td>
                                        <td className="equipment-table-date">
                                            <div className="equipment-table-icon-content">
                                                <Calendar size={16} className="equipment-table-icon" />
                                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="equipment-table-user">
                                            <div className="equipment-table-icon-content">
                                                <User size={16} className="equipment-table-icon" />
                                                <span>{item.usingUser._id === user?.id ? "You" : item.usingUser.name}</span>
                                            </div>
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
                                        <IndianRupee size={16} className="equipment-price-icon" />
                                        {formatCurrency(parseFloat(item.amount.$numberDecimal))}
                                    </div>
                                </div>
                                <div className="equipment-card-body">
                                    <div className="equipment-card-detail">
                                        <MapPin size={18} className="equipment-card-icon" />
                                        <div className="equipment-card-detail-content">
                                            <span className="equipment-card-label">Location</span>
                                            <span className="equipment-card-value equipment-card-location">{item.location}</span>
                                        </div>
                                    </div>
                                    <div className="equipment-card-detail">
                                        <Calendar size={18} className="equipment-card-icon" />
                                        <div className="equipment-card-detail-content">
                                            <span className="equipment-card-label">Added On</span>
                                            <span className="equipment-card-value equipment-card-date">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="equipment-card-detail">
                                        <User size={18} className="equipment-card-icon" />
                                        <div className="equipment-card-detail-content">
                                            <span className="equipment-card-label">Assigned To</span>
                                            <span className="equipment-card-value equipment-card-user">
                                                {item.usingUser._id === user?.id ? "You" : item.usingUser.name}
                                            </span>
                                        </div>
                                    </div>
                                    {item.funding_by_srp_id && (
                                        <div className="equipment-card-detail">
                                            <Settings size={18} className="equipment-card-icon" />
                                            <div className="equipment-card-detail-content">
                                                <span className="equipment-card-label">Funded By</span>
                                                <span className="equipment-card-value equipment-card-funding">
                                                    {item.funding_by_srp_id.agency}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="equipment-empty-state">
                    <div className="equipment-empty-content">
                        <Package className="equipment-empty-icon" size={50} />
                        <h3>No Equipment Found</h3>
                        <p>Try adjusting your search or add new equipment</p>
                        <button
                            className="equipment-add-button"
                            onClick={() => navigate("/manage-equipment")}
                        >
                            <Plus size={18} /> Add Equipment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserEquipmentList;