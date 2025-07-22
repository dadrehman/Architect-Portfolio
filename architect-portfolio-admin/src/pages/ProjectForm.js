// src/pages/ProjectForm.js - FIXED VERSION - NO DUPLICATE SIDEBAR
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaImages, FaTimes } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { isAuthenticated, getToken } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [featured, setFeatured] = useState(false);
  
  // Image state
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  // Categories
  const [categories, setCategories] = useState(['Residential', 'Commercial', 'Cultural', 'Educational', 'Industrial']);
  const [newCategory, setNewCategory] = useState('');
  
  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.architectshahab.site/api/projects/categories');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            setCategories(data.data);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch categories, using defaults');
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch project details if editing
  useEffect(() => {
    const fetchProject = async () => {
      if (isEditMode) {
        setIsLoading(true);
        try {
          const token = getToken();
          if (!token) {
            toast.error('Authentication token is missing');
            navigate('/login');
            return;
          }
          
          const response = await fetch(`https://api.architectshahab.site/api/projects/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch project');
          }
          
          const data = await response.json();
          
          if (data.success && data.data) {
            const project = data.data;
            setTitle(project.title || '');
            setCategory(project.category || '');
            setDescription(project.description || '');
            setClient(project.client || '');
            setLocation(project.location || '');
            setYear(project.year || new Date().getFullYear().toString());
            setFeatured(project.featured || false);
            
            if (project.image_main) {
              setMainImagePreview(`https://api.architectshahab.site${project.image_main}`);
            }
            
            if (project.gallery) {
              const gallery = typeof project.gallery === 'string' 
                ? JSON.parse(project.gallery) 
                : project.gallery;
                
              if (Array.isArray(gallery)) {
                const previews = gallery.map(path => `https://api.architectshahab.site${path}`);
                setGalleryPreviews(previews);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching project:', error);
          setError('Failed to load project data. Please try again.');
          toast.error('Failed to load project data');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchProject();
  }, [id, isEditMode, navigate, getToken]);
  
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGalleryImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  const removeGalleryImage = (index) => {
    const newImages = [...galleryImages];
    const newPreviews = [...galleryPreviews];
    
    // Revoke object URL to prevent memory leaks
    if (galleryImages[index] instanceof File) {
      URL.revokeObjectURL(galleryPreviews[index]);
    }
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setGalleryImages(newImages);
    setGalleryPreviews(newPreviews);
  };
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setCategory(newCategory.trim());
      setNewCategory('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate form
      if (!title.trim()) {
        throw new Error('Project title is required');
      }
      
      if (!category.trim()) {
        throw new Error('Category is required');
      }
      
      // Create FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('client', client);
      formData.append('location', location);
      formData.append('year', year);
      formData.append('featured', featured);
      
      // Add main image if present
      if (mainImage) {
        formData.append('mainImage', mainImage);
      }
      
      // Add gallery images
      galleryImages.forEach(image => {
        if (image instanceof File) {
          formData.append('galleryImages', image);
        }
      });
      
      // Get token
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }
      
      // API URL
      const url = isEditMode 
        ? `https://api.architectshahab.site/api/projects/${id}`
        : 'https://api.architectshahab.site/api/projects';
      
      // Log request details for debugging
      console.log('Submitting project to:', url);
      console.log('Using authorization token:', token.substring(0, 15) + '...');
      
      // Make request
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - browser will set it with boundary
        }
      });
      
      // Get response data, handling case where response might not be JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = { success: false, message: 'Invalid response from server' };
      }
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          toast.error('Your session has expired. Please log in again.');
          navigate('/login');
          return;
        }
        
        throw new Error(responseData.message || `Server error: ${response.status}`);
      }
      
      // Success!
      toast.success(isEditMode ? 'Project updated successfully' : 'Project created successfully');
      navigate('/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      setError(error.message || 'Failed to save project');
      toast.error(error.message || 'Failed to save project');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && isEditMode) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/projects')}
          className="mr-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Projects
        </Button>
        <h1 className="text-2xl font-medium text-gray-800">
          {isEditMode ? 'Edit Project' : 'Add New Project'}
        </h1>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Project Information">
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                              bg-white border focus:border-blue-500 focus:ring-2 
                              focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-l-md border-gray-300 shadow-sm px-4 py-3 
                                  bg-white border focus:border-blue-500 focus:ring-2 
                                  focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="flex">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Or add new..."
                          className="w-full rounded-none border-gray-300 shadow-sm px-4 py-3 
                                    bg-white border focus:border-blue-500 focus:ring-2 
                                    focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                        />
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          className="px-4 py-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 
                                    transition duration-200 focus:outline-none focus:ring-2 
                                    focus:ring-blue-500 focus:ring-opacity-50"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      id="year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                              bg-white border focus:border-blue-500 focus:ring-2 
                              focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                      Client
                    </label>
                    <input
                      type="text"
                      id="client"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                              bg-white border focus:border-blue-500 focus:ring-2 
                              focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                              bg-white border focus:border-blue-500 focus:ring-2 
                              focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="6"
                    className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                            bg-white border focus:border-blue-500 focus:ring-2 
                            focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                  />
                </div>
                
                <div className="form-group">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                      Featured Project (shown on homepage)
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card title="Project Images">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                  <div className="mt-2">
                    {mainImagePreview ? (
                      <div className="relative">
                        <img
                          src={mainImagePreview}
                          alt="Main preview"
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setMainImage(null);
                            setMainImagePreview('');
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                        <FaImages className="h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Upload a main image
                        </p>
                        <input
                          type="file"
                          name="mainImage"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
                  <div className="mt-2">
                    {galleryPreviews.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {galleryPreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Gallery preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center">
                      <FaImages className="h-6 w-6 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">
                        Add gallery images
                      </p>
                      <input
                        type="file"
                        name="galleryImages"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImagesChange}
                        className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/projects')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            isLoading={isLoading}
          >
            <FaSave className="mr-2" />
            {isEditMode ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;