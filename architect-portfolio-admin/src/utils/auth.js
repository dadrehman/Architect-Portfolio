// src/utils/auth.js - FIXED VERSION OF YOUR EXISTING FILE
const TOKEN_KEY = 'architecture_admin_token';

/**
 * Store token in localStorage with expiry time
 * @param {string} token - JWT token
 * @returns {boolean} - Success of operation
 */
export const setToken = (token) => {
  if (token) {
    try {
      // Store the token
      localStorage.setItem(TOKEN_KEY, token);
      
      // Parse the token to get expiry
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      // Store expiry time if present in token, otherwise default to 24 hours
      const expiryTime = decoded.exp 
        ? decoded.exp * 1000 
        : new Date().getTime() + 24 * 60 * 60 * 1000;
      
      localStorage.setItem(`${TOKEN_KEY}_expiry`, expiryTime.toString());
      
      return true;
    } catch (error) {
      console.error('Error setting token:', error);
      return false;
    }
  }
  return false;
};

/**
 * Get token from localStorage and check if it's expired
 * @returns {string|null} - JWT token or null if not found/expired
 */
export const getToken = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const tokenExpiry = localStorage.getItem(`${TOKEN_KEY}_expiry`);
    
    if (!token) return null;
    
    // Check if token is expired
    if (tokenExpiry) {
      const now = new Date().getTime();
      if (now >= parseInt(tokenExpiry, 10)) {
        // Token expired, remove it
        removeToken();
        return null;
      }
    }
    
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(`${TOKEN_KEY}_expiry`);
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get user data from token
 * @returns {object|null} - User data or null
 */
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    
    return {
      id: decoded.id,
      username: decoded.username || 'Admin',
      email: decoded.email
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// ADDED: Missing function that was causing the issue in api.js
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};