import React, { useEffect, useState } from 'react';
import '../../styles/Venues/VenueListComponent.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom

const VenueListComponent = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.user); // Accessing user data from Redux state
    const navigate = useNavigate(); // Initialize navigate hook

    useEffect(() => {
        // Only fetch venues if user ID is available
        if (user && user.id) {
            const fetchVenues = async () => {
                try {
                    // Fetch venues using the user ID
                    const response = await fetch(`/api/v1/venues/${user.id}`); // Using template literal to insert user ID
                    if (!response.ok) {
                        throw new Error('Failed to fetch venues');
                    }
                    const data = await response.json();
                    console.log(data.venues);

                    setVenues(data.venues);
                } catch (error) {
                    console.error('Error fetching venues:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchVenues();
        } else {
            console.error('User ID is not available');
            setLoading(false);
        }
    }, [user]); // Re-run the effect whenever the user data changes

    const handleManageClick = () => {
        // Navigate to the edit page for the selected venue
        navigate(`/edit-venue`);
    };

    return (
        <div className="venue-list-container">
            <button
                className="manage-venue-btn"
                onClick={() => handleManageClick()}
            >
                Manage
            </button>
            <h2 className="venue-list-title">Your Venues</h2>
            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : venues.length === 0 ? (
                <div className="no-venues">No venues found.</div>
            ) : (
                <ul className="venue-list">
                    {venues.map((venueDetail) => (
                        <li key={venueDetail._id} className="venue-item">
                            <div className="venue-details">
                                <h3>{venueDetail.venue}</h3>
                                <p>{venueDetail.location}</p>
                                <p>{venueDetail.description}</p>
                                <p className="venue-date">
                                    Date: {new Date(venueDetail.date).toLocaleDateString()}
                                </p>
                                <p className="venue-year">Year: {venueDetail.year}</p>
                                <p className="venue-time-zone">
                                    Time Zone: {venueDetail.time_zone || 'Not specified'}
                                </p>
                            </div>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VenueListComponent;
