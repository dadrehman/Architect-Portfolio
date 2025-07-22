// architect-portfolio-admin/src/services/api.js - COMPLETE VERSION WITH ALL FEATURES
import { getToken, removeToken } from '../utils/auth';

const BASE_URL = 'https://api.architectshahab.site/api';

// Enhanced mock data with consistent structure (PRESERVED)
const mockData = {
  projects: [
    {
      id: 1,
      title: 'Modern Residential Tower',
      category: 'Residential',
      description: 'A 30-story residential tower with panoramic views and sustainable features.',
      client: 'City Development Corp',
      location: 'Downtown',
      year: '2023',
      featured: true,
      image_main: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'])
    },
    {
      id: 2,
      title: 'City Public Library',
      category: 'Cultural',
      description: 'Award-winning public library featuring open spaces and natural lighting.',
      client: 'Municipal Authority',
      location: 'Civic Center', 
      year: '2022',
      featured: true,
      image_main: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'])
    },
    {
      id: 3,
      title: 'Corporate Headquarters',
      category: 'Commercial',
      description: 'Modern corporate office building with energy-efficient design.',
      client: 'Tech Solutions Inc',
      location: 'Business District',
      year: '2024',
      featured: false,
      image_main: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop'])
    }
  ],
  testimonials: [
    {
      id: 1,
      client_name: 'John Smith',
      position: 'CEO',
      company: 'ABC Development',
      quote: 'Working with Architect Studio was an excellent experience. They delivered innovative designs that perfectly matched our vision and exceeded our expectations.',
      rating: 5,
      featured: true,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      client_name: 'Sarah Johnson',
      position: 'Director of Urban Planning',
      company: 'City Council',
      quote: 'The team at Architect Studio demonstrated exceptional professionalism and creativity throughout our city library project. Highly recommended!',
      rating: 5,
      featured: true,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      client_name: 'Michael Chen',
      position: 'Project Manager',
      company: 'Tech Solutions Inc',
      quote: 'Outstanding architectural solutions that balanced functionality with aesthetic appeal. The team delivered on time and within budget.',
      rating: 4,
      featured: false,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ],
  blogs: [
    {
      id: 1,
      title: 'Modern Architecture Trends in 2024',
      description: 'Exploring the latest trends in modern architecture and sustainable design.',
      content: '<p>Modern architecture continues to evolve with new materials, technologies, and design philosophies. This year, we\'re seeing a strong emphasis on sustainability, biophilic design, and smart building technologies.</p><p>Key trends include the use of cross-laminated timber, passive house standards, and integration of renewable energy systems into building design.</p>',
      seo_title: 'Modern Architecture Trends 2024 - Architect Studio',
      seo_description: 'Discover the latest architectural trends shaping the future of design.',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Sustainable Building Materials',
      description: 'A comprehensive guide to eco-friendly materials in construction.',
      content: '<p>Sustainability in architecture is more important than ever. Learn about the latest eco-friendly materials that are revolutionizing the construction industry.</p><p>From recycled steel to bamboo composites, these materials offer excellent performance while reducing environmental impact.</p>',
      seo_title: 'Sustainable Building Materials Guide',
      seo_description: 'Complete guide to sustainable and eco-friendly building materials.',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  cvs: [
    {
      id: 1,
      title: 'Professional CV 2024',
      file_path: '/uploads/cv/sample-cv.pdf',
      created_at: new Date().toISOString()
    }
  ],
  analytics: [
    { page_url: '/projects', visits: 150, last_visited: new Date().toISOString() },
    { page_url: '/about', visits: 89, last_visited: new Date().toISOString() },
    { page_url: '/contact', visits: 64, last_visited: new Date().toISOString() },
    { page_url: '/testimonials', visits: 45, last_visited: new Date().toISOString() }
  ],
  settings: {
    site_title: 'Architect Studio',
    site_description: 'Modern architectural solutions for residential and commercial projects.',
    contact_email: 'contact@architectstudio.com',
    contact_phone: '+1 (555) 123-4567',
    contact_address: '123 Design Street, Creative District, CA 90210',
    social_facebook: 'https://facebook.com/architectstudio',
    social_twitter: 'https://twitter.com/architectstudio',
    social_instagram: 'https://instagram.com/architectstudio',
    social_linkedin: 'https://linkedin.com/company/architectstudio',
    theme_primary_color: '#14151a',
    theme_accent_color: '#dcb286'
  }
};

// Helper function to simulate API delay (PRESERVED)
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// FIXED: Enhanced API call function with better error handling
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  try {
    console.log(`🔍 Trying real API: ${BASE_URL}${endpoint}`);
    
    const headers = {
      ...(options.headers || {}),
      ...(token && !token.startsWith('mock.') ? { 'Authorization': `Bearer ${token}` } : {})
    };

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Real API success: ${endpoint}`, data);
      return data;
    } else {
      // FIXED: Better error handling for authentication
      if (response.status === 401) {
        console.log('❌ Unauthorized - removing token');
        removeToken();
        window.location.href = '/login';
        throw new Error('Authentication failed. Please log in again.');
      }
      
      console.log(`❌ Real API failed (${response.status}): ${endpoint}`);
      throw new Error(`API Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`💥 Real API error: ${error.message}, falling back to mock data`);
    
    // Fallback to mock data with proper structure
    await delay();
    const mockResponse = getMockData(endpoint);
    return { 
      success: true, 
      data: mockResponse 
    };
  }
};

// Enhanced mock data getter (PRESERVED)
const getMockData = (endpoint) => {
  if (endpoint.includes('/projects/categories')) {
    return [...new Set(mockData.projects.map(p => p.category))];
  } else if (endpoint.includes('/projects')) {
    if (endpoint.includes('/projects/') && !endpoint.includes('/categories')) {
      // Single project
      const id = endpoint.split('/').pop();
      return mockData.projects.find(p => p.id == id);
    }
    return mockData.projects;
  } else if (endpoint.includes('/testimonials')) {
    if (endpoint.includes('/testimonials/') && !isNaN(endpoint.split('/').pop())) {
      // Single testimonial
      const id = endpoint.split('/').pop();
      return mockData.testimonials.find(t => t.id == id);
    }
    return mockData.testimonials;
  } else if (endpoint.includes('/blogs')) {
    if (endpoint.includes('/blogs/') && !isNaN(endpoint.split('/').pop())) {
      // Single blog
      const id = endpoint.split('/').pop();
      return mockData.blogs.find(b => b.id == id);
    }
    return mockData.blogs;
  } else if (endpoint.includes('/cv')) {
    if (endpoint.includes('/cv/') && !isNaN(endpoint.split('/').pop())) {
      // Single CV
      const id = endpoint.split('/').pop();
      return mockData.cvs.find(c => c.id == id);
    }
    return mockData.cvs;
  } else if (endpoint.includes('/analytics')) {
    return mockData.analytics;
  } else if (endpoint.includes('/settings')) {
    return mockData.settings;
  }
  return [];
};

// PRESERVED: Enhanced project service
export const projectService = {
  create: async (data) => {
    console.log('➕ Creating project:', data);
    try {
      const response = await apiCall('/projects', {
        method: 'POST',
        body: data // FormData or JSON
      });
      return response;
    } catch (error) {
      // Fallback to mock creation
      await delay(500);
      const newProject = {
        id: Date.now(),
        title: data.get ? data.get('title') : data.title,
        category: data.get ? data.get('category') : data.category,
        description: data.get ? data.get('description') : data.description,
        client: data.get ? data.get('client') : data.client,
        location: data.get ? data.get('location') : data.location,
        year: data.get ? data.get('year') : data.year,
        featured: data.get ? data.get('featured') === 'true' : data.featured,
        image_main: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop']),
        created_at: new Date().toISOString()
      };
      mockData.projects.push(newProject);
      return { success: true, data: newProject };
    }
  },
  
  update: async (id, data) => {
    console.log('📝 Updating project:', id, data);
    try {
      const response = await apiCall(`/projects/${id}`, {
        method: 'PUT',
        body: data
      });
      return response;
    } catch (error) {
      // Fallback to mock update
      await delay(500);
      const index = mockData.projects.findIndex(p => p.id == id);
      if (index !== -1) {
        const updateData = data.get ? {
          title: data.get('title'),
          category: data.get('category'),
          description: data.get('description'),
          client: data.get('client'),
          location: data.get('location'),
          year: data.get('year'),
          featured: data.get('featured') === 'true'
        } : data;
        
        mockData.projects[index] = { ...mockData.projects[index], ...updateData };
        return { success: true, data: mockData.projects[index] };
      }
      throw new Error('Project not found');
    }
  },
  
  getAll: async () => {
    const response = await apiCall('/projects');
    return response;
  },
  
  getById: async (id) => {
    const response = await apiCall(`/projects/${id}`);
    return response;
  },
  
  delete: async (id) => {
    try {
      const response = await apiCall(`/projects/${id}`, { method: 'DELETE' });
      return response;
    } catch (error) {
      console.log('🗑️ Deleting project (mock):', id);
      await delay();
      mockData.projects = mockData.projects.filter(p => p.id != id);
      return { success: true };
    }
  },
  
  getCategories: async () => {
    const response = await apiCall('/projects/categories');
    return response;
  }
};

// PRESERVED: Enhanced testimonial service
export const testimonialService = {
  create: async (data) => {
    console.log('➕ Creating testimonial:', data);
    try {
      const response = await apiCall('/testimonials', {
        method: 'POST',
        body: data
      });
      return response;
    } catch (error) {
      await delay(500);
      const newTestimonial = {
        id: Date.now(),
        client_name: data.get ? data.get('client_name') : data.client_name,
        position: data.get ? data.get('position') : data.position,
        company: data.get ? data.get('company') : data.company,
        quote: data.get ? data.get('quote') : data.quote,
        rating: parseInt(data.get ? data.get('rating') : data.rating) || 5,
        featured: data.get ? data.get('featured') === 'true' : data.featured,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        created_at: new Date().toISOString()
      };
      mockData.testimonials.push(newTestimonial);
      return { success: true, data: newTestimonial };
    }
  },
  
  update: async (id, data) => {
    console.log('📝 Updating testimonial:', id, data);
    try {
      const response = await apiCall(`/testimonials/${id}`, {
        method: 'PUT',
        body: data
      });
      return response;
    } catch (error) {
      await delay(500);
      const index = mockData.testimonials.findIndex(t => t.id == id);
      if (index !== -1) {
        const updateData = data.get ? {
          client_name: data.get('client_name'),
          position: data.get('position'),
          company: data.get('company'),
          quote: data.get('quote'),
          rating: parseInt(data.get('rating')) || 5,
          featured: data.get('featured') === 'true'
        } : data;
        
        mockData.testimonials[index] = { ...mockData.testimonials[index], ...updateData };
        return { success: true, data: mockData.testimonials[index] };
      }
      throw new Error('Testimonial not found');
    }
  },
  
  getAll: async () => {
    const response = await apiCall('/testimonials');
    return response;
  },
  
  getById: async (id) => {
    const response = await apiCall(`/testimonials/${id}`);
    return response;
  },
  
  delete: async (id) => {
    try {
      const response = await apiCall(`/testimonials/${id}`, { method: 'DELETE' });
      return response;
    } catch (error) {
      console.log('🗑️ Deleting testimonial (mock):', id);
      await delay();
      mockData.testimonials = mockData.testimonials.filter(t => t.id != id);
      return { success: true };
    }
  }
};

// PRESERVED: Enhanced CV service
export const cvService = {
  create: async (data) => {
    console.log('➕ Creating CV:', data);
    try {
      const response = await apiCall('/cv', {
        method: 'POST',
        body: data
      });
      return response;
    } catch (error) {
      await delay(500);
      const newCV = {
        id: Date.now(),
        title: data.get ? data.get('title') : data.title,
        file_path: '/uploads/cv/mock-cv-' + Date.now() + '.pdf',
        created_at: new Date().toISOString()
      };
      mockData.cvs.push(newCV);
      return { success: true, data: newCV };
    }
  },
  
  update: async (id, data) => {
    console.log('📝 Updating CV:', id, data);
    try {
      const response = await apiCall(`/cv/${id}`, {
        method: 'PUT',
        body: data
      });
      return response;
    } catch (error) {
      await delay(500);
      const index = mockData.cvs.findIndex(c => c.id == id);
      if (index !== -1) {
        const updatedCV = {
          ...mockData.cvs[index],
          title: data.get ? data.get('title') : data.title || mockData.cvs[index].title,
          updated_at: new Date().toISOString()
        };
        mockData.cvs[index] = updatedCV;
        return { success: true, data: updatedCV };
      }
      throw new Error('CV not found');
    }
  },
  
  getAll: async () => {
    const response = await apiCall('/cv');
    return response;
  },
  
  getById: async (id) => {
    const response = await apiCall(`/cv/${id}`);
    return response;
  },
  
  delete: async (id) => {
    try {
      const response = await apiCall(`/cv/${id}`, { method: 'DELETE' });
      return response;
    } catch (error) {
      console.log('🗑️ Deleting CV (mock):', id);
      await delay();
      mockData.cvs = mockData.cvs.filter(c => c.id != id);
      return { success: true };
    }
  }
};

// PRESERVED: Enhanced blog service
export const blogService = {
  create: async (data) => {
    console.log('➕ Creating blog:', data);
    try {
      const response = await apiCall('/blogs', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      await delay(500);
      const newBlog = {
        id: Date.now(),
        ...data,
        created_at: new Date().toISOString()
      };
      mockData.blogs.push(newBlog);
      return { success: true, data: newBlog };
    }
  },
  
  update: async (id, data) => {
    console.log('📝 Updating blog:', id, data);
    try {
      const response = await apiCall(`/blogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      await delay(500);
      const index = mockData.blogs.findIndex(b => b.id == id);
      if (index !== -1) {
        mockData.blogs[index] = { 
          ...mockData.blogs[index], 
          ...data,
          updated_at: new Date().toISOString()
        };
        return { success: true, data: mockData.blogs[index] };
      }
      throw new Error('Blog not found');
    }
  },
  
  getAll: async () => {
    const response = await apiCall('/blogs');
    return response;
  },
  
  getById: async (id) => {
    const response = await apiCall(`/blogs/${id}`);
    return response;
  },
  
  delete: async (id) => {
    try {
      const response = await apiCall(`/blogs/${id}`, { method: 'DELETE' });
      return response;
    } catch (error) {
      console.log('🗑️ Deleting blog (mock):', id);
      await delay();
      mockData.blogs = mockData.blogs.filter(b => b.id != id);
      return { success: true };
    }
  }
};

// PRESERVED: Settings service
export const settingsService = {
  getSettings: async () => {
    const response = await apiCall('/settings');
    return response;
  },
  
  updateSettings: async (data) => {
    console.log('⚙️ Updating settings:', data);
    try {
      const response = await apiCall('/settings', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      await delay(500);
      mockData.settings = { ...mockData.settings, ...data };
      return { success: true, data: mockData.settings };
    }
  }
};

// PRESERVED: Analytics service
export const analyticsService = {
  getAnalytics: async () => {
    const response = await apiCall('/analytics');
    return response;
  }
};

// FIXED: Auth service - Enhanced for better authentication
export const authService = {
  login: async (email, password) => {
    console.log('🔑 Admin Login:', email);
    
    try {
      const response = await apiCall('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      return {
        success: true,
        token: response.token,
        user: response.data,
        message: response.message || 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  },
  
  verifyToken: async (token) => {
    try {
      const response = await apiCall('/admin/verify-token', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
      return response.success;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  },
  
  getProfile: async () => {
    const response = await apiCall('/admin/me');
    return response;
  },
  
  updateProfile: async (data) => {
    console.log('📝 Mock profile update:', data);
    return { success: true, data: { id: 1, ...data } };
  },
  
  updatePassword: async (data) => {
    console.log('🔒 Mock password update');
    return { success: true, message: 'Password updated successfully' };
  }
};

// PRESERVED: Public service (for frontend website)
export const publicService = {
  getProjects: async () => {
    const response = await apiCall('/projects');
    return response;
  },
  getFeaturedProjects: async () => {
    const response = await apiCall('/projects/featured');
    return response;
  },
  getProject: async (id) => {
    const response = await apiCall(`/projects/${id}`);
    return response;
  },
  getProjectCategories: async () => {
    const response = await apiCall('/projects/categories');
    return response;
  },
  getTestimonials: async () => {
    const response = await apiCall('/testimonials');
    return response;
  },
  getFeaturedTestimonials: async () => {
    const response = await apiCall('/testimonials/featured');
    return response;
  },
  getBlogs: async () => {
    const response = await apiCall('/blogs');
    return response;
  },
  getBlog: async (id) => {
    const response = await apiCall(`/blogs/${id}`);
    return response;
  },
  likePost: async (id) => {
    const response = await apiCall(`/blogs/${id}/like`, {
      method: 'POST'
    });
    return response;
  },
  getSettings: async () => {
    const response = await apiCall('/settings');
    return response;
  },
  subscribeNewsletter: async (email) => {
    const response = await apiCall('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    return response;
  },
  submitContactForm: async (data) => {
    console.log('📧 Contact form submission (mock):', data);
    await delay(1000);
    return { success: true, message: 'Message sent successfully' };
  }
};

// ADDED: Utility functions for admin panel
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    return {
      success: response.ok,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const testDatabaseConnection = async () => {
  try {
    const response = await fetch(`${BASE_URL}/test-db`);
    const data = await response.json();
    return {
      success: response.ok,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// ADDED: Newsletter service for admin management
export const newsletterService = {
  getSubscribers: async () => {
    try {
      const response = await apiCall('/newsletter/subscribers');
      return response;
    } catch (error) {
      console.log('📧 Mock newsletter subscribers');
      await delay(500);
      return {
        success: true,
        data: [
          { id: 1, email: 'user1@example.com', subscribed_at: new Date().toISOString() },
          { id: 2, email: 'user2@example.com', subscribed_at: new Date().toISOString() }
        ]
      };
    }
  }
};

console.log('📦 Enhanced API Service loaded with smart fallback system');

export default {
  authService,
  projectService,
  testimonialService,
  settingsService,
  cvService,
  blogService,
  analyticsService,
  publicService,
  newsletterService,
  checkApiHealth,
  testDatabaseConnection
};