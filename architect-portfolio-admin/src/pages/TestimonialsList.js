// src/pages/TestimonialsList.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { testimonialService } from '../services/api';

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching testimonials...');
        
        const response = await testimonialService.getAll();
        console.log('✅ Testimonials Response:', response);
        
        // Handle different response structures
        let testimonialsData = [];
        if (response?.data?.data) {
          testimonialsData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          testimonialsData = response.data;
        } else if (Array.isArray(response)) {
          testimonialsData = response;
        }
        
        // Ensure it's an array
        testimonialsData = Array.isArray(testimonialsData) ? testimonialsData : [];
        
        setTestimonials(testimonialsData);
        
        console.log('📊 Loaded testimonials:', testimonialsData.length);
        
      } catch (error) {
        console.error('💥 Error fetching testimonials:', error);
        setError('Failed to load testimonials. Please try again.');
        toast.error('Failed to load testimonials');
        
        // Set empty array to prevent crashes
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await testimonialService.delete(id);
        setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
        toast.success('Testimonial deleted successfully');
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const handleToggleFeatured = async (id, featured) => {
    try {
      const testimonial = testimonials.find(t => t.id === id);
      if (!testimonial) {
        toast.error('Testimonial not found');
        return;
      }
      
      await testimonialService.update(id, { ...testimonial, featured: !featured });
      
      setTestimonials(testimonials.map(t => 
        t.id === id ? { ...t, featured: !t.featured } : t
      ));
      
      toast.success(`Testimonial ${featured ? 'unfeatured' : 'featured'} successfully`);
    } catch (error) {
      console.error('Error updating testimonial featured status:', error);
      toast.error('Failed to update testimonial');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Testimonials</h1>
            <p className="text-gray-500">Manage your client testimonials</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button to="/testimonials/new" variant="primary">
              <FaPlus className="mr-2" />
              Add New Testimonial
            </Button>
          </div>
        </div>
        <Card>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Testimonials</h1>
            <p className="text-gray-500">Manage your client testimonials</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button to="/testimonials/new" variant="primary">
              <FaPlus className="mr-2" />
              Add New Testimonial
            </Button>
          </div>
        </div>
        <Card>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">Testimonials</h1>
          <p className="text-gray-500">Manage your client testimonials</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button to="/testimonials/new" variant="primary">
            <FaPlus className="mr-2" />
            Add New Testimonial
          </Button>
        </div>
      </div>
      
      <Card>
        {testimonials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position & Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {testimonial.image ? (
                          <img 
                            src={testimonial.image.startsWith('http') 
                              ? testimonial.image 
                              : `https://api.architectshahab.site${testimonial.image}`
                            } 
                            alt={testimonial.client_name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3"
                             style={{ display: testimonial.image ? 'none' : 'flex' }}>
                          <FaUser className="text-gray-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                          {testimonial.client_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{testimonial.position || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{testimonial.company || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex text-yellow-500">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <FaStar key={i} className="mr-0.5" />
                        ))}
                        {[...Array(5 - (testimonial.rating || 5))].map((_, i) => (
                          <FaRegStar key={i} className="mr-0.5 text-gray-300" />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(testimonial.id, testimonial.featured)}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                        title={testimonial.featured ? "Remove from featured" : "Add to featured"}
                      >
                        {testimonial.featured ? <FaStar size={18} /> : <FaRegStar size={18} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Link 
                          to={`/testimonials/edit/${testimonial.id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit testimonial"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteTestimonial(testimonial.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete testimonial"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center">
            <FaUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No testimonials found</p>
            <Button to="/testimonials/new" variant="primary">
              <FaPlus className="mr-2" />
              Add First Testimonial
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TestimonialsList;