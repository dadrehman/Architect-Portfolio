// src/services/api.js - USER-SIDE PUBLIC WEBSITE API
import axios from 'axios';

const BASE_URL = 'https://api.architectshahab.site/api';

const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for logging
publicApi.interceptors.request.use(
  (config) => {
    console.log(`🌐 User-side API request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🌐 User-side API request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for consistent data handling
publicApi.interceptors.response.use(
  (response) => {
    console.log(`✅ User-side API success: ${response.config.url}`, response.data);
    
    // Handle different response structures from backend
    if (response.data && response.data.success !== undefined) {
      // Backend returns { success: true, data: [...] }
      return {
        ...response,
        data: response.data.data || response.data
      };
    }
    
    // Return as-is if already in expected format
    return response;
  },
  (error) => {
    console.error('❌ User-side API error:', error.response?.data || error.message);
    
    // Enhanced error handling
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'An error occurred while fetching data';
    
    throw new Error(errorMessage);
  }
);

// Track page visits for analytics
const trackPageVisit = async (pageUrl) => {
  try {
    await publicApi.post('/analytics/track', { page_url: pageUrl });
  } catch (error) {
    // Don't throw errors for tracking - it's not critical for user experience
    console.warn('Failed to track page visit:', error.message);
  }
};

export const publicService = {
  // Settings
  getSettings: async () => {
    try {
      console.log('🌐 User-side: Fetching settings');
      const response = await publicApi.get('/settings');
      return response;
    } catch (error) {
      console.error('🌐 User-side: Error fetching settings:', error);
      throw new Error('Failed to load website settings.');
    }
  },

  // Projects
  getProjects: async () => {
    try {
      console.log('🌐 User-side: Fetching all projects');
      trackPageVisit('/projects'); // Track visit
      const response = await publicApi.get('/projects');
      return response;
    } catch (error) {
      console.error('🌐 User-side: Error fetching projects:', error);
      throw new Error('Failed to load projects.');
    }
  },

  getFeaturedProjects: async () => {
    try {
      console.log('🌐 User-side: Fetching featured projects');
      const response = await publicApi.get('/projects/featured');
      return response;
    } catch (error) {
      console.error('🌐 User-side: Error fetching featured projects:', error);
      throw new Error('Failed to load featured projects.');
    }
  },

  getProject: async (id) => {
    try {
      console.log(`🌐 User-side: Fetching project with ID ${id}`);
      trackPageVisit(`/projects/${id}`); // Track visit
      const response = await publicApi.get(`/projects/${id}`);
      return response;
    } catch (error) {
      console.error(`🌐 User-side: Error fetching project with ID ${id}:`, error);
      throw new Error('Failed to load project details.');
    }
  },

  getProjectCategories: async () => {
    try {
      console.log('🌐 User-side: Fetching project categories');
      const response = await publicApi.get('/projects/categories');
      return response;
    } catch (error) {
      console.error('🌐 User-side: Error fetching project categories:', error);
      throw new Error('Failed to load project categories.');
    }
  },

  getProjectsByCategory: async (category) => {
    try {
      console.log(`🌐 User-side: Fetching projects in category: ${category}`);
      trackPageVisit(`/projects/category/${category}`); // Track visit
      const response = await publicApi.get(`/projects/category/${category}`);
      return response;
    } catch (error) {
      console.error(`🌐 User-side: Error fetching projects by category ${category}:`, error);
      throw new Error('Failed to load projects for this category.');
    }
  },

  // Testimonials
  getTestimonials: async () => {
    try {
      console.log('🌐 User-side: Fetching all testimonials');
      trackPageVisit('/testimonials'); // Track visit
      const response = await publicApi.get('/testimonials');
      return response;
    } catch (error) {
      console.error('🌐 User-side: Error fetching testimonials:', error);
      throw new Error('Failed to load testimonials.');
    }
  },

  getFeaturedTestimonials: async () => {
    try {
      console.log('🌐 User-side: Fetching featured testimonials');
      const response = await publicApi.get('/testimonials/featured');
      return response;
    } catch (error) {
      console.error('🌐 User-side: Error fetching featured testimonials:', error);
      throw new Error('Failed to load featured testimonials.');
    }
  },

  // Blogs
  getAllBlogs: async () => {
    try {
      console.log('🌐 User-side: Fetching all blogs');
      trackPageVisit('/blogs'); // Track visit
      const response = await publicApi.get('/blogs');
      return response;
    } catch (error) {
      console.error('🌐 User-side: Error fetching blogs:', error);
      throw new Error('Failed to load blog posts.');
    }
  },

  getBlogById: async (id) => {
    try {
      console.log(`🌐 User-side: Fetching blog with ID ${id}`);
      trackPageVisit(`/blogs/${id}`); // Track visit
      const response = await publicApi.get(`/blogs/${id}`);
      return response;
    } catch (error) {
      console.error(`🌐 User-side: Error fetching blog with ID ${id}:`, error);
      throw new Error('Failed to load blog post.');
    }
  },

  likeBlog: async (id) => {
    try {
      console.log(`🌐 User-side: Liking blog with ID ${id}`);
      const response = await publicApi.post(`/blogs/${id}/like`);
      return response;
    } catch (error) {
      console.error('🌐 User-side: Error liking blog:', error);
      throw new Error('Failed to like blog post.');
    }
  },

  // CVs
  getAllCVs: async () => {
    try {
      console.log('🌐 User-side: Fetching all CVs');
      trackPageVisit('/cv'); // Track visit
      const response = await publicApi.get('/cv');
      return response;
    } catch (error) {
      console.error('🌐 User-side: Error fetching CVs:', error);
      throw new Error('Failed to load CVs.');
    }
  },

  getCVById: async (id) => {
    try {
      console.log(`🌐 User-side: Fetching CV with ID ${id}`);
      const response = await publicApi.get(`/cv/${id}`);
      return response;
    } catch (error) {
      console.error(`🌐 User-side: Error fetching CV with ID ${id}:`, error);
      throw new Error('Failed to load CV.');
    }
  },

  // Newsletter
  subscribeNewsletter: async (email) => {
    try {
      console.log('🌐 User-side: Subscribing to newsletter');
      
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      
      const response = await publicApi.post('/newsletter/subscribe', { email });
      return response;
    } catch (error) {
      console.error('🌐 User-side: Error subscribing to newsletter:', error);
      throw new Error(error.message || 'Failed to subscribe to newsletter.');
    }
  },

  // Contact Form
  submitContactForm: async (data) => {
    try {
      console.log('🌐 User-side: Submitting contact form');
      trackPageVisit('/contact'); // Track visit
      
      // Validate required fields
      if (!data.name || !data.email || !data.message) {
        throw new Error('Please fill in all required fields.');
      }
      
      if (!data.email.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }

      // For now, simulate successful submission
      // You can implement actual email sending on the backend later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        data: {
          success: true,
          message: 'Thank you for your message! We will get back to you soon.'
        }
      };
    } catch (error) {
      console.error('🌐 User-side: Error submitting contact form:', error);
      throw new Error(error.message || 'Failed to submit contact form.');
    }
  },

  // Analytics (for internal tracking)
  trackPageVisit: trackPageVisit,

  // Health check
  checkHealth: async () => {
    try {
      const response = await publicApi.get('/health');
      return response;
    } catch (error) {
      console.error('🌐 User-side: API health check failed:', error);
      return { data: { success: false, message: 'API unavailable' } };
    }
  }
};

// Default export for backward compatibility
export default publicService;

console.log('🌐 User-side API service loaded - Public website integration');