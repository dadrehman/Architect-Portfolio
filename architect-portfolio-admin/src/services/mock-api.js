// architect-portfolio/services/mock-api.js
// This file creates mock API functionality that works without a backend

// Use localStorage to persist data between page refreshes
const getStoredData = (key, defaultData = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultData;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
    return false;
  }
};

// Initial data if storage is empty
const initialProjects = [
  {
    id: 1,
    title: 'Modern Residential Tower',
    category: 'Residential',
    description: 'A 30-story residential tower with panoramic views and sustainable features.',
    client: 'City Development Corp',
    location: 'Downtown',
    year: '2023',
    featured: true,
    image_main: '/placeholder/600x400',
    gallery: JSON.stringify(['/placeholder/1200x800', '/placeholder/1200x800'])
  },
  {
    id: 2,
    title: 'City Public Library',
    category: 'Cultural',
    description: 'An award-winning public library featuring open spaces and natural lighting.',
    client: 'Municipal Authority',
    location: 'Civic Center', 
    year: '2022',
    featured: true,
    image_main: '/placeholder/600x400',
    gallery: JSON.stringify(['/placeholder/1200x800', '/placeholder/1200x800'])
  }
];

const initialTestimonials = [
  {
    id: 1,
    client_name: 'John Smith',
    position: 'CEO',
    company: 'ABC Development',
    quote: 'Working with Architect Studio was an excellent experience. They delivered innovative designs that perfectly matched our vision.',
    rating: 5,
    featured: true,
    image: '/placeholder/user/1'
  },
  {
    id: 2,
    client_name: 'Sarah Johnson',
    position: 'Director of Urban Planning',
    company: 'City Council',
    quote: 'The team at Architect Studio demonstrated exceptional professionalism and creativity throughout our city library project.',
    rating: 5,
    featured: true,
    image: '/placeholder/user/2'
  }
];

const initialSettings = {
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
  theme_accent_color: '#dcb286',
};

// Initialize storage with default data if empty
const initializeStorage = () => {
  const projectsData = getStoredData('projects', []);
  const testimonialsData = getStoredData('testimonials', []);
  const settingsData = getStoredData('settings', {});

  if (projectsData.length === 0) {
    setStoredData('projects', initialProjects);
  }
  
  if (testimonialsData.length === 0) {
    setStoredData('testimonials', initialTestimonials);
  }
  
  if (Object.keys(settingsData).length === 0) {
    setStoredData('settings', initialSettings);
  }
};

// Initialize on first load
initializeStorage();

// Create a delay to simulate network request
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Extract file data from FormData
const extractFormData = (formData) => {
  const data = {};
  for (const [key, value] of formData.entries()) {
    // Skip file objects, handle them separately
    if (!(value instanceof File)) {
      data[key] = value;
    }
  }
  return data;
};

// Handle file data with mock URLs
const processFileData = (formData, data) => {
  if (formData.get('mainImage') instanceof File) {
    data.image_main = '/placeholder/600x400';
  }
  
  if (formData.get('image') instanceof File) {
    data.image = '/placeholder/user/avatar';
  }
  
  const galleryFiles = formData.getAll('galleryImages');
  if (galleryFiles && galleryFiles.some(file => file instanceof File)) {
    const galleryUrls = galleryFiles.map((_, index) => `/placeholder/1200x800/${index}`);
    data.gallery = JSON.stringify(galleryUrls);
  }
  
  return data;
};

// Mock API services
export const mockProjectService = {
  getAll: async () => {
    await delay();
    const projects = getStoredData('projects', initialProjects);
    return { data: { data: projects, success: true } };
  },
  
  getById: async (id) => {
    await delay();
    const projects = getStoredData('projects', initialProjects);
    const project = projects.find(p => p.id === parseInt(id) || p.id === id);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    return { data: { data: project, success: true } };
  },
  
  create: async (formData) => {
    await delay(500);
    const projects = getStoredData('projects', initialProjects);
    
    let data = {};
    if (formData instanceof FormData) {
      data = extractFormData(formData);
      data = processFileData(formData, data);
    } else {
      data = formData;
    }
    
    const newProject = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString()
    };
    
    projects.push(newProject);
    setStoredData('projects', projects);
    
    return { data: { data: newProject, success: true } };
  },
  
  update: async (id, formData) => {
    await delay(500);
    const projects = getStoredData('projects', initialProjects);
    const index = projects.findIndex(p => p.id === parseInt(id) || p.id === id);
    
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    let data = {};
    if (formData instanceof FormData) {
      data = extractFormData(formData);
      data = processFileData(formData, data);
    } else {
      data = formData;
    }
    
    const updatedProject = {
      ...projects[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    projects[index] = updatedProject;
    setStoredData('projects', projects);
    
    return { data: { data: updatedProject, success: true } };
  },
  
  delete: async (id) => {
    await delay();
    const projects = getStoredData('projects', initialProjects);
    const newProjects = projects.filter(p => p.id !== parseInt(id) && p.id !== id);
    
    setStoredData('projects', newProjects);
    
    return { data: { success: true } };
  },
  
  getCategories: async () => {
    await delay();
    const projects = getStoredData('projects', initialProjects);
    const categories = [...new Set(projects.map(p => p.category))];
    return { data: { data: categories, success: true } };
  }
};

export const mockTestimonialService = {
  getAll: async () => {
    await delay();
    const testimonials = getStoredData('testimonials', initialTestimonials);
    return { data: { data: testimonials, success: true } };
  },
  
  getById: async (id) => {
    await delay();
    const testimonials = getStoredData('testimonials', initialTestimonials);
    const testimonial = testimonials.find(t => t.id === parseInt(id) || t.id === id);
    
    if (!testimonial) {
      throw new Error('Testimonial not found');
    }
    
    return { data: { data: testimonial, success: true } };
  },
  
  create: async (formData) => {
    await delay(500);
    const testimonials = getStoredData('testimonials', initialTestimonials);
    
    let data = {};
    if (formData instanceof FormData) {
      data = extractFormData(formData);
      data = processFileData(formData, data);
    } else {
      data = formData;
    }
    
    const newTestimonial = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString()
    };
    
    testimonials.push(newTestimonial);
    setStoredData('testimonials', testimonials);
    
    return { data: { data: newTestimonial, success: true } };
  },
  
  update: async (id, formData) => {
    await delay(500);
    const testimonials = getStoredData('testimonials', initialTestimonials);
    const index = testimonials.findIndex(t => t.id === parseInt(id) || t.id === id);
    
    if (index === -1) {
      throw new Error('Testimonial not found');
    }
    
    let data = {};
    if (formData instanceof FormData) {
      data = extractFormData(formData);
      data = processFileData(formData, data);
    } else {
      data = formData;
    }
    
    const updatedTestimonial = {
      ...testimonials[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    testimonials[index] = updatedTestimonial;
    setStoredData('testimonials', testimonials);
    
    return { data: { data: updatedTestimonial, success: true } };
  },
  
  delete: async (id) => {
    await delay();
    const testimonials = getStoredData('testimonials', initialTestimonials);
    const newTestimonials = testimonials.filter(t => t.id !== parseInt(id) && t.id !== id);
    
    setStoredData('testimonials', newTestimonials);
    
    return { data: { success: true } };
  }
};

export const mockSettingsService = {
  getAll: async () => {
    await delay();
    const settings = getStoredData('settings', initialSettings);
    return { data: { data: settings, success: true } };
  },
  
  update: async (data) => {
    await delay(500);
    const settings = getStoredData('settings', initialSettings);
    
    const updatedSettings = {
      ...settings,
      ...data,
      updated_at: new Date().toISOString()
    };
    
    setStoredData('settings', updatedSettings);
    
    return { data: { data: updatedSettings, success: true } };
  }
};