import axios from 'axios';

// Use environment variable for API URL, fallback to relative path for local development
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

