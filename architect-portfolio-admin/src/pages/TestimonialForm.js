// src/pages/TestimonialForm.js - FIXED VERSION - NO DUPLICATE SIDEBAR
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaUser, FaTimes, FaStar } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { testimonialService } from '../services/api';

const testimonialSchema = Yup.object().shape({
  client_name: Yup.string().required('Client name is required'),
  position: Yup.string(),
  company: Yup.string(),
  quote: Yup.string().required('Testimonial quote is required'),
  rating: Yup.number().min(1).max(5).default(5),
  featured: Yup.boolean(),
});

const TestimonialForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [testimonial, setTestimonial] = useState({
    client_name: '',
    position: '',
    company: '',
    quote: '',
    rating: 5,
    featured: true, // Default to true to ensure visibility on public frontend
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditMode) {
          setLoading(true);
          setError(null);
          
          console.log('Fetching testimonial with ID:', id);
          try {
            const response = await testimonialService.getById(id);
            console.log('Testimonial data received:', response.data);
            
            const testimonialData = response.data.data;
            
            setTestimonial({
              client_name: testimonialData.client_name || '',
              position: testimonialData.position || '',
              company: testimonialData.company || '',
              quote: testimonialData.quote || '',
              rating: testimonialData.rating || 5,
              featured: testimonialData.featured || false,
            });
            
            if (testimonialData.image) {
              // Handle image URL depending on if it's a full URL or path
              const imageUrl = testimonialData.image.startsWith('http') 
                ? testimonialData.image 
                : `${process.env.REACT_APP_API_URL || 'https://api.architectshahab.site'}${testimonialData.image}`;
              setImagePreview(imageUrl);
            }
          } catch (error) {
            console.error('Error fetching testimonial:', error);
            setError('Failed to load testimonial data. Please try again.');
            toast.error('Failed to load testimonial data');
            
            // Navigate back to testimonials list if testimonial not found
            navigate('/testimonials');
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initialization:', error);
        setError('Failed to initialize form. Please try again.');
        toast.error('Failed to initialize form');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode, navigate]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleRatingChange = (newRating, setFieldValue) => {
    setFieldValue('rating', newRating);
  };
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSaveLoading(true);
      setError(null);
      
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Ensure boolean values are correctly passed
      const processedValues = {
        ...values,
        featured: values.featured === true || values.featured === 'true'
      };
      
      // Add form values to FormData
      Object.keys(processedValues).forEach(key => {
        // Convert boolean to string for FormData
        if (typeof processedValues[key] === 'boolean') {
          formData.append(key, processedValues[key].toString());
        } else {
          formData.append(key, processedValues[key]);
        }
      });
      
      // Add image if present
      if (image) {
        formData.append('image', image);
      }
      
      console.log('Submitting testimonial data...');
      // Log the form data for debugging (non-sensitive data only)
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name}`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      try {
        if (isEditMode) {
          console.log(`Updating testimonial with ID: ${id}`);
          await testimonialService.update(id, formData);
          toast.success('Testimonial updated successfully');
        } else {
          console.log('Creating new testimonial');
          await testimonialService.create(formData);
          toast.success('Testimonial created successfully');
        }
        
        // Navigate back to the testimonials list
        navigate('/testimonials');
      } catch (error) {
        console.error('API Error:', error);
        
        // Show more detailed error information
        let errorMessage = 'Failed to save testimonial. Please try again.';
        if (error.response) {
          console.error('Error response data:', error.response.data);
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.request) {
          console.error('Error request:', error.request);
          errorMessage = 'No response from server. Please check your connection.';
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = 'Failed to save testimonial. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaveLoading(false);
      setSubmitting(false);
    }
  };
  
  if (loading) {
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
          onClick={() => navigate('/testimonials')}
          className="mr-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Testimonials
        </Button>
        <h1 className="text-2xl font-medium text-gray-800">
          {isEditMode ? 'Edit Testimonial' : 'Add New Testimonial'}
        </h1>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <Formik
        initialValues={testimonial}
        validationSchema={testimonialSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card title="Testimonial Information">
                  <div className="space-y-4">
                    <div className="form-group">
                      <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Client Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="client_name"
                        id="client_name"
                        className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                  bg-white border focus:border-blue-500 focus:ring-2 
                                  focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                          errors.client_name && touched.client_name ? 'border-red-500' : ''
                        }`}
                      />
                      <ErrorMessage name="client_name" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                          Position
                        </label>
                        <Field
                          type="text"
                          name="position"
                          id="position"
                          className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                  bg-white border focus:border-blue-500 focus:ring-2 
                                  focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <Field
                          type="text"
                          name="company"
                          id="company"
                          className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                  bg-white border focus:border-blue-500 focus:ring-2 
                                  focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">
                        Testimonial Quote <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="textarea"
                        name="quote"
                        id="quote"
                        rows="6"
                        className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                  bg-white border focus:border-blue-500 focus:ring-2 
                                  focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                          errors.quote && touched.quote ? 'border-red-500' : ''
                        }`}
                      />
                      <ErrorMessage name="quote" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                        Rating (1-5 stars)
                      </label>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star, setFieldValue)}
                            className={`text-2xl ${
                              values.rating >= star ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                          >
                            <FaStar />
                          </button>
                        ))}
                        <span className="ml-2 text-gray-600">({values.rating} stars)</span>
                        <Field type="hidden" name="rating" />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <div className="flex items-center">
                        <Field
                          type="checkbox"
                          name="featured"
                          id="featured"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                          Featured Testimonial (shown on homepage)
                        </label>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <Card title="Client Image">
                  <div className="space-y-4">
                    <div>
                      <div className="mt-2">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Client preview"
                              className="w-40 h-40 object-cover rounded-full mx-auto"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImage(null);
                                setImagePreview('');
                              }}
                              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                            >
                              <FaTimes size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-full p-6 flex flex-col items-center w-40 h-40 mx-auto">
                            <FaUser className="h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500 text-center">
                              Client Photo (Optional)
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-medium
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
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
                onClick={() => navigate('/testimonials')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || saveLoading}
                isLoading={isSubmitting || saveLoading}
              >
                <FaSave className="mr-2" />
                {isEditMode ? 'Update Testimonial' : 'Create Testimonial'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TestimonialForm;