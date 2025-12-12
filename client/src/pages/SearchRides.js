import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RatingBadge from '../components/RatingBadge';
import './SearchRides.css';

const SearchRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: '',
    sort: 'date',
    order: 'asc',
    minRating: '',
    maxPrice: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchParams.origin) params.append('origin', searchParams.origin);
      if (searchParams.destination) params.append('destination', searchParams.destination);
      if (searchParams.date) params.append('date', searchParams.date);
      if (searchParams.sort) params.append('sort', searchParams.sort);
      if (searchParams.order) params.append('order', searchParams.order);
      if (searchParams.minRating) params.append('minRating', searchParams.minRating);
      if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);

      const response = await axios.get(`/api/rides?${params.toString()}`);
      setRides(response.data);
    } catch (err) {
      setError('Failed to fetch rides. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRides();
  };

  const handleBookRide = async (rideId, seatsAvailable) => {
    if (!user) {
      alert('Please login to book a ride');
      return;
    }

    const seats = prompt(`How many seats do you need? (Available: ${seatsAvailable})`);
    if (!seats || isNaN(seats) || parseInt(seats) <= 0) {
      return;
    }

    if (parseInt(seats) > seatsAvailable) {
      alert(`Only ${seatsAvailable} seats available`);
      return;
    }

    try {
      await axios.post('/api/bookings', { rideId, seats: parseInt(seats) });
      alert('Ride booked successfully!');
      fetchRides();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to book ride');
    }
  };

  return (
    <div className="search-rides">
      <h1>Search Rides</h1>

      <div className="card search-form-card">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label>From</label>
            <input
              type="text"
              value={searchParams.origin}
              onChange={(e) => handleInputChange('origin', e.target.value)}
              placeholder="Enter origin city"
            />
          </div>

          <div className="form-group">
            <label>To</label>
            <input
              type="text"
              value={searchParams.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              placeholder="Enter destination city"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={searchParams.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="filter-row">
            <div className="form-group">
              <label>Sort By</label>
              <select
                value={searchParams.sort}
                onChange={(e) => handleInputChange('sort', e.target.value)}
              >
                <option value="date">Date & Time</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div className="form-group">
              <label>Order</label>
              <select
                value={searchParams.order}
                onChange={(e) => handleInputChange('order', e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div className="form-group">
              <label>Min Rating</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.5"
                value={searchParams.minRating}
                placeholder="e.g., 4"
                onChange={(e) => handleInputChange('minRating', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Max Price ($)</label>
              <input
                type="number"
                min="0"
                value={searchParams.maxPrice}
                placeholder="No limit"
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
            Search
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="text-center" style={{ padding: '40px' }}>Loading rides...</div>
      ) : rides.length === 0 ? (
        <div className="empty-state">
          <h3>No rides found</h3>
          <p>Try adjusting your search criteria or check back later.</p>
        </div>
      ) : (
        <div className="rides-list">
          {rides.map((ride) => (
            <div key={ride.id} className="card ride-card">
              <div className="ride-header">
                <div>
                  <h3>{ride.origin} → {ride.destination}</h3>
                  <p className="ride-driver">Driver: {ride.driverName}</p>
                  <RatingBadge value={ride.averageRating} count={ride.ratingCount} />
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

              {user && ride.seatsAvailable > 0 && (
                <button
                  onClick={() => handleBookRide(ride.id, ride.seatsAvailable)}
                  className="btn btn-primary"
                  style={{ marginTop: '16px' }}
                >
                  Book Ride
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchRides;

