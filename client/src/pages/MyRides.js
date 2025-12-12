import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RatingBadge from '../components/RatingBadge';
import './MyRides.css';

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await axios.get('/api/rides/driver/my-rides');
      setRides(response.data);
    } catch (err) {
      setError('Failed to fetch your rides');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center" style={{ padding: '40px' }}>Loading...</div>;
  }

  return (
    <div className="my-rides">
      <h1>My Rides</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {rides.length === 0 ? (
        <div className="empty-state">
          <h3>No rides posted yet</h3>
          <p>Start sharing your rides and help others save money!</p>
        </div>
      ) : (
        <div className="rides-list">
          {rides.map((ride) => (
            <div key={ride.id} className="card ride-card">
              <div className="ride-header">
                <div>
                  <h3>{ride.origin} → {ride.destination}</h3>
                  <span className={`status-badge status-${ride.status}`}>
                    {ride.status}
                  </span>
                  <RatingBadge value={ride.averageRating} count={ride.ratingCount} size="sm" />
                </div>
                <div className="ride-price">${ride.price}</div>
              </div>

              <div className="ride-details">
                <div className="ride-detail">
                  <span className="detail-label">📅 Date:</span>
                  <span>{new Date(ride.date).toLocaleDateString()}</span>
                </div>
                <div className="ride-detail">
                  <span className="detail-label">🕐 Time:</span>
                  <span>{ride.time}</span>
                </div>
                <div className="ride-detail">
                  <span className="detail-label">💺 Seats:</span>
                  <span>{ride.seatsAvailable} available</span>
                </div>
                {ride.carModel && (
                  <div className="ride-detail">
                    <span className="detail-label">🚗 Car:</span>
                    <span>{ride.carModel}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRides;

