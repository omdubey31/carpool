import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostRide = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    seatsAvailable: '',
    price: '',
    carModel: '',
    carNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('/api/rides', formData);
      setSuccess('Ride posted successfully!');
      setFormData({
        origin: '',
        destination: '',
        date: '',
        time: '',
        seatsAvailable: '',
        price: '',
        carModel: '',
        carNumber: ''
      });
      setTimeout(() => {
        navigate('/my-rides');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Post a Ride</h1>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>From *</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              required
              placeholder="Enter origin city"
            />
          </div>

          <div className="form-group">
            <label>To *</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              placeholder="Enter destination city"
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Seats Available *</label>
              <input
                type="number"
                name="seatsAvailable"
                value={formData.seatsAvailable}
                onChange={handleChange}
                required
                min="1"
                placeholder="Number of seats"
              />
            </div>

            <div className="form-group">
              <label>Price per Seat ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Price"
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Car Model</label>
              <input
                type="text"
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                placeholder="e.g., Toyota Camry"
              />
            </div>

            <div className="form-group">
              <label>Car Number</label>
              <input
                type="text"
                name="carNumber"
                value={formData.carNumber}
                onChange={handleChange}
                placeholder="License plate number"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Ride'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostRide;

