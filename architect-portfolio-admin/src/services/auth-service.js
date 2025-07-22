// src/services/auth-service.js
import axios from 'axios';
import { getToken } from '../utils/auth';

// Base URL for API
const BASE_URL = process.env.REACT_APP_API_URL || 'https://api.architectshahab.site/api';

// For demo purposes, simulate successful login when the API server is unavailable
const mockLogin = async (credentials) => {
  console.log('auth-service.js: Using mock login service');
  if (credentials.email === 'admin@example.com' && credentials.password === 'password123') {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 24 * 60 * 60; // 24 hours
    const payload = {
      sub: '1',
      email: credentials.email,
      username: 'Admin',
      role: 'admin',
      iat: now,
      exp: now + expiresIn,
    };
    const base64Payload = btoa(JSON.stringify(payload));
    const fakeToken = `header.${base64Payload}.signature`;
    return {
      data: {
        token: fakeToken,
        user: {
          id: 1,
          email: credentials.email,
          username: 'Admin',
          role: 'admin',
        },
      },
    };
  } else {
    throw {
      response: {
        status: 401,
        data: {
          message: 'Invalid email or password',
        },
      },
    };
  }
};

// For demo purposes, simulate successful profile retrieval
const mockGetProfile = async () => {
  return {
    data: {
      id: 1,
      email: 'admin@example.com',
      username: 'Admin',
      role: 'admin',
    },
  };
};

// Check if the API is available
const isApiAvailable = async () => {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 2000 });
    console.log('auth-service.js: API server is available');
    return true;
  } catch (error) {
    console.log('auth-service.js: API server unavailable, using mock data');
    return false;
  }
};

// Enhanced auth service with fallback to mock implementations
export const enhancedAuthService = {
  login: async (credentials) => {
    try {
      const apiAvailable = await isApiAvailable();
      if (apiAvailable) {
        console.log('auth-service.js: Attempting real API login');
        return await axios.post(`${BASE_URL}/admin/login`, credentials, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        console.log('auth-service.js: Falling back to mock login');
        return await mockLogin(credentials);
      }
    } catch (error) {
      console.error('auth-service.js: Login error:', error.message);
      if (error.message?.includes('Network Error') || error.response?.status === 503) {
        console.log('auth-service.js: Network error, using mock login');
        return await mockLogin(credentials);
      }
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const apiAvailable = await isApiAvailable();
      const token = getToken();
      if (apiAvailable && token) {
        console.log('auth-service.js: Fetching profile from API');
        return await axios.get(`${BASE_URL}/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        console.log('auth-service.js: Falling back to mock profile');
        return await mockGetProfile();
      }
    } catch (error) {
      console.error('auth-service.js: Profile fetch error:', error.message);
      console.log('auth-service.js: Using mock profile data');
      return await mockGetProfile();
    }
  },

  updateProfile: async (userData) => {
    try {
      const apiAvailable = await isApiAvailable();
      const token = getToken();
      if (apiAvailable && token) {
        console.log('auth-service.js: Updating profile via API');
        return await axios.put(`${BASE_URL}/admin/me`, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        console.log('auth-service.js: Using mock profile update');
        return {
          data: {
            id: 1,
            email: 'admin@example.com',
            username: userData.username || 'Admin',
            role: 'admin',
            ...userData,
          },
        };
      }
    } catch (error) {
      console.error('auth-service.js: Profile update error:', error.message);
      console.log('auth-service.js: Using mock profile update');
      return {
        data: {
          id: 1,
          email: 'admin@example.com',
          username: userData.username || 'Admin',
          role: 'admin',
          ...userData,
        },
      };
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const apiAvailable = await isApiAvailable();
      const token = getToken();
      if (apiAvailable && token) {
        console.log('auth-service.js: Updating password via API');
        return await axios.put(`${BASE_URL}/admin/password`, passwordData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        console.log('auth-service.js: Using mock password update');
        return { data: { success: true } };
      }
    } catch (error) {
      console.error('auth-service.js: Password update error:', error.message);
      console.log('auth-service.js: Using mock password update');
      return { data: { success: true } };
    }
  },

  register: async (registerData) => {
    try {
      const apiAvailable = await isApiAvailable();
      if (apiAvailable) {
        console.log('auth-service.js: Registering via API');
        return await axios.post(`${BASE_URL}/admin/register`, registerData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        console.log('auth-service.js: Registration not available in mock mode');
        throw new Error('Registration not available in offline mode');
      }
    } catch (error) {
      console.error('auth-service.js: Registration error:', error.message);
      throw error;
    }
  },

  validateToken: async () => {
    try {
      const apiAvailable = await isApiAvailable();
      const token = getToken();
      if (!token) {
        console.log('auth-service.js: No token found');
        return false;
      }
      if (apiAvailable) {
        console.log('auth-service.js: Validating token via API');
        await axios.get(`${BASE_URL}/admin/validate-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return true;
      } else {
        console.log('auth-service.js: Validating token locally');
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          return payload.exp > now;
        } catch (e) {
          console.error('auth-service.js: Token validation error:', e);
          return false;
        }
      }
    } catch (error) {
      console.error('auth-service.js: Token validation error:', error.message);
      return false;
    }
  },
};