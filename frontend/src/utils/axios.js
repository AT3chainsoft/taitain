import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 30000, // Increase timeout for slower connections
});

// Add request interceptor to include auth token in all requests
instance.interceptors.request.use(
  (config) => {
    // Get fresh token on each request to ensure it's current
    const token = localStorage.getItem('token');
    
    if (token) {
      // Add token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      
      // For debugging
      console.log('Using auth token for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Track if we've shown an auth error already to avoid multiple popups
let hasShownAuthError = false;

// Add response interceptor to handle common errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If response exists
    if (error.response) {
      const { status, data } = error.response;
      
      // Log all API errors with details
      console.log(`Auth error detected: ${status}`, data);
      
      // Handle authentication errors (401/403)
      if (status === 401 || status === 403) {
        // Mark as auth error for components to handle
        error.isAuthError = true;
        
        // Check if token is present but invalid
        if (localStorage.getItem('token')) {
          console.error('Token present but request failed with', status);
        } else {
          console.error('No token present for authenticated request');
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;
