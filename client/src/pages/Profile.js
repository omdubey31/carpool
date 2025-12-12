import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RatingBadge from '../components/RatingBadge';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, refreshUser, loading } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      refreshUser().catch(() => {});
    }
  }, [user, refreshUser]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !user) {
    return <div className="text-center" style={{ padding: '40px' }}>Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center" style={{ padding: '40px' }}>Please log in to view your profile.</div>;
  }

  const stats = user.stats || {};

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="grid grid-3 profile-stats">
        <div className="card stat-card">
          <p className="stat-label">Rides Posted</p>
          <p className="stat-value">{stats.totalRidesPosted || 0}</p>
        </div>
        <div className="card stat-card">
          <p className="stat-label">Bookings Made</p>
          <p className="stat-value">{stats.totalBookings || 0}</p>
        </div>
        <div className="card stat-card stat-rating">
          <p className="stat-label">Driver Rating</p>
          <RatingBadge
            value={stats.averageDriverRating || 0}
            count={stats.ratingsReceived || 0}
            size="lg"
          />
        </div>
      </div>

      <div className="card profile-form-card">
        <h2>Update Details</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Add a contact number"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

