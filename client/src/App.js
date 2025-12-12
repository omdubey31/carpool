import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchRides from './pages/SearchRides';
import PostRide from './pages/PostRide';
import MyRides from './pages/MyRides';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchRides />} />
              <Route 
                path="/post-ride" 
                element={
                  <PrivateRoute>
                    <PostRide />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-rides" 
                element={
                  <PrivateRoute>
                    <MyRides />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-bookings" 
                element={
                  <PrivateRoute>
                    <MyBookings />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

