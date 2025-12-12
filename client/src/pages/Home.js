import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <h1>Share Rides, Save Money</h1>
        <p className="hero-subtitle">
          Connect with drivers and passengers going your way. 
          Make your commute affordable and eco-friendly.
        </p>
        <div className="hero-buttons">
          {user ? (
            <>
              <Link to="/post-ride" className="btn btn-primary btn-large">
                Post a Ride
              </Link>
              <Link to="/search" className="btn btn-secondary btn-large">
                Find a Ride
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/search" className="btn btn-secondary btn-large">
                Browse Rides
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Why Choose CarPool?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Save Money</h3>
            <p>Split travel costs with fellow commuters and save on fuel expenses.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Eco-Friendly</h3>
            <p>Reduce your carbon footprint by sharing rides and reducing traffic.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Meet People</h3>
            <p>Connect with neighbors and colleagues on your daily commute.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Easy & Fast</h3>
            <p>Simple booking process. Find or post rides in minutes.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create a free account in seconds</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Post or Search</h3>
            <p>Post your ride as a driver or search for available rides</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Book & Ride</h3>
            <p>Book your seat and enjoy your journey</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

