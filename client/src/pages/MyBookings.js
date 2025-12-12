import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingInputs, setRatingInputs] = useState({});
  const [ratingLoading, setRatingLoading] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/my-bookings');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch your bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (bookingId, field, value) => {
    setRatingInputs(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [field]: value
      }
    }));
  };

  const handleSubmitRating = async (booking) => {
    const inputs = ratingInputs[booking.id] || {};
    if (!inputs.rating) {
      alert('Please choose a rating between 1 and 5 stars.');
      return;
    }

    setRatingLoading(prev => ({ ...prev, [booking.id]: true }));
    try {
      await axios.post(`/api/rides/${booking.ride.id}/rate`, {
        rating: inputs.rating,
        comment: inputs.comment
      });
      alert('Thanks for rating your ride!');
      setRatingInputs(prev => {
        const updated = { ...prev };
        delete updated[booking.id];
        return updated;
      });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit rating');
    } finally {
      setRatingLoading(prev => ({ ...prev, [booking.id]: false }));
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return <div className="text-center" style={{ padding: '40px' }}>Loading...</div>;
  }

  return (
    <div className="my-bookings">
      <h1>My Bookings</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>Book a ride to see it here!</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="card booking-card">
              {booking.ride ? (
                <>
                  <div className="booking-header">
                    <div>
                      <h3>{booking.ride.origin} → {booking.ride.destination}</h3>
                      <p className="booking-driver">Driver: {booking.ride.driverName}</p>
                    </div>
                    <div className="booking-price">${booking.ride.price} × {booking.seats}</div>
                  </div>

                  <div className="booking-details">
                    <div className="booking-detail">
                      <span className="detail-label">📅 Date:</span>
                      <span>{new Date(booking.ride.date).toLocaleDateString()}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="detail-label">🕐 Time:</span>
                      <span>{booking.ride.time}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="detail-label">💺 Seats Booked:</span>
                      <span>{booking.seats}</span>
                    </div>
                    <div className="booking-detail">
                      <span className="detail-label">💰 Total:</span>
                      <span>${(booking.ride.price * booking.seats).toFixed(2)}</span>
                    </div>
                    {booking.ride.carModel && (
                      <div className="booking-detail">
                        <span className="detail-label">🚗 Car:</span>
                        <span>{booking.ride.carModel}</span>
                      </div>
                    )}
                  </div>

                  <div className="booking-actions">
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="btn btn-danger"
                    >
                      Cancel Booking
                    </button>
                  </div>

                  {(() => {
                    const rideDate = new Date(`${booking.ride.date}T${booking.ride.time || '00:00'}`);
                    const canRate = rideDate < new Date();

                    if (booking.rating) {
                      return (
                        <div className="booking-rating">
                          <p>Your Rating: ⭐ {booking.rating.rating} / 5</p>
                          {booking.rating.comment && (
                            <p className="rating-comment">“{booking.rating.comment}”</p>
                          )}
                        </div>
                      );
                    }

                    if (!canRate) {
                      return (
                        <div className="booking-rating muted">
                          You can rate this ride after {rideDate.toLocaleString()}.
                        </div>
                      );
                    }

                    return (
                      <div className="rating-form">
                        <h4>Rate this ride</h4>
                        <div className="grid grid-2">
                          <div className="form-group">
                            <label>Rating</label>
                            <select
                              value={ratingInputs[booking.id]?.rating || ''}
                              onChange={(e) => handleRatingChange(booking.id, 'rating', e.target.value)}
                            >
                              <option value="">Select rating</option>
                              {[5, 4, 3, 2, 1].map(value => (
                                <option key={value} value={value}>{value} Stars</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Comment (optional)</label>
                            <input
                              type="text"
                              value={ratingInputs[booking.id]?.comment || ''}
                              onChange={(e) => handleRatingChange(booking.id, 'comment', e.target.value)}
                              placeholder="What stood out?"
                            />
                          </div>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSubmitRating(booking)}
                          disabled={!!ratingLoading[booking.id]}
                        >
                          {ratingLoading[booking.id] ? 'Submitting...' : 'Submit Rating'}
                        </button>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <p>Ride information not available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

