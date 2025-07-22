// src/pages/Settings.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaSave, FaGlobe, FaPalette, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { AiFillFacebook, AiFillTwitterSquare, AiFillInstagram, AiFillLinkedin } from 'react-icons/ai';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { settingsService } from '../services/api';

const settingsSchema = Yup.object().shape({
  site_title: Yup.string().required('Site title is required'),
  site_description: Yup.string(),
  contact_email: Yup.string().email('Invalid email address'),
  contact_phone: Yup.string(),
  contact_address: Yup.string(),
  social_facebook: Yup.string().url('Must be a valid URL'),
  social_twitter: Yup.string().url('Must be a valid URL'),
  social_instagram: Yup.string().url('Must be a valid URL'),
  social_linkedin: Yup.string().url('Must be a valid URL'),
  theme_primary_color: Yup.string(),
  theme_accent_color: Yup.string(),
});

const Settings = () => {
  const [settings, setSettings] = useState({
    site_title: 'Architect Studio',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    social_linkedin: '',
    theme_primary_color: '#14151a',
    theme_accent_color: '#dcb286',
  });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching settings...');
        
        const response = await settingsService.getSettings();
        console.log('✅ Settings Response:', response);
        
        // Handle different response structures
        let settingsData = {};
        if (response?.data?.data) {
          settingsData = response.data.data;
        } else if (response?.data && typeof response.data === 'object') {
          settingsData = response.data;
        } else if (typeof response === 'object') {
          settingsData = response;
        }
        
        // Merge with defaults
        setSettings(prevSettings => ({
          ...prevSettings,
          ...settingsData
        }));
        
        console.log('📊 Loaded settings:', settingsData);
        
      } catch (error) {
        console.error('💥 Error fetching settings:', error);
        setError('Failed to load settings. Using default values.');
        toast.error('Failed to load settings. Using default values.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSaveLoading(true);
      setError(null);
      
      console.log('💾 Saving settings:', values);
      
      await settingsService.updateSettings(values);
      setSettings(values);
      toast.success('Settings updated successfully');
      
    } catch (error) {
      console.error('💥 Error updating settings:', error);
      setError('Failed to update settings. Please try again.');
      toast.error('Failed to update settings');
    } finally {
      setSaveLoading(false);
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-800">Site Settings</h1>
          <p className="text-gray-500">Configure your website settings</p>
        </div>
        <Card>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-800">Site Settings</h1>
        <p className="text-gray-500">Configure your website settings</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <Formik
        initialValues={settings}
        validationSchema={settingsSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* General Settings */}
              <Card title="General Settings">
                <div className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="site_title" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaGlobe className="mr-2 text-blue-500" />
                      Site Title <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Field
                      type="text"
                      name="site_title"
                      id="site_title"
                      className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                bg-white border focus:border-blue-500 focus:ring-2 
                                focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                        errors.site_title && touched.site_title ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="site_title" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="site_description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaGlobe className="mr-2 text-blue-500" />
                      Site Description
                    </label>
                    <Field
                      as="textarea"
                      name="site_description"
                      id="site_description"
                      rows="3"
                      className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                bg-white border focus:border-blue-500 focus:ring-2 
                                focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                        errors.site_description && touched.site_description ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="site_description" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
              </Card>
              
              {/* Theme Settings */}
              <Card title="Theme Settings">
                <div className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="theme_primary_color" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaPalette className="mr-2 text-blue-500" />
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-10 h-10 rounded border border-gray-300"
                        style={{ backgroundColor: values.theme_primary_color }}
                      ></div>
                      <Field
                        type="text"
                        name="theme_primary_color"
                        id="theme_primary_color"
                        className="flex-1 rounded-md border-gray-300 shadow-sm px-4 py-3 bg-white border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                      />
                      <input
                        type="color"
                        value={values.theme_primary_color}
                        onChange={(e) => setFieldValue('theme_primary_color', e.target.value)}
                        className="w-10 h-10 cursor-pointer rounded"
                      />
                    </div>
                    <ErrorMessage name="theme_primary_color" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="theme_accent_color" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaPalette className="mr-2 text-blue-500" />
                      Accent Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-10 h-10 rounded border border-gray-300"
                        style={{ backgroundColor: values.theme_accent_color }}
                      ></div>
                      <Field
                        type="text"
                        name="theme_accent_color"
                        id="theme_accent_color"
                        className="flex-1 rounded-md border-gray-300 shadow-sm px-4 py-3 bg-white border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                      />
                      <input
                        type="color"
                        value={values.theme_accent_color}
                        onChange={(e) => setFieldValue('theme_accent_color', e.target.value)}
                        className="w-10 h-10 cursor-pointer rounded"
                      />
                    </div>
                    <ErrorMessage name="theme_accent_color" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-gray-500 mb-3">Color Preview:</p>
                    <div className="flex space-x-4">
                      <div className="text-center">
                        <div
                          className="w-20 h-20 mx-auto rounded-md mb-2"
                          style={{ backgroundColor: values.theme_primary_color }}
                        ></div>
                        <span className="text-xs text-gray-600">Primary</span>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-20 h-20 mx-auto rounded-md mb-2"
                          style={{ backgroundColor: values.theme_accent_color }}
                        ></div>
                        <span className="text-xs text-gray-600">Accent</span>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto rounded-md mb-2 flex items-center justify-center"
                          style={{ backgroundColor: values.theme_primary_color }}>
                          <div className="w-10 h-10 rounded-full"
                            style={{ backgroundColor: values.theme_accent_color }}></div>
                        </div>
                        <span className="text-xs text-gray-600">Combination</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Contact Information */}
              <Card title="Contact Information">
                <div className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaEnvelope className="mr-2 text-blue-500" />
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="contact_email"
                      id="contact_email"
                      className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                bg-white border focus:border-blue-500 focus:ring-2 
                                focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                        errors.contact_email && touched.contact_email ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="contact_email" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaPhone className="mr-2 text-blue-500" />
                      Phone Number
                    </label>
                    <Field
                      type="text"
                      name="contact_phone"
                      id="contact_phone"
                      className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                bg-white border focus:border-blue-500 focus:ring-2 
                                focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                        errors.contact_phone && touched.contact_phone ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="contact_phone" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contact_address" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" />
                      Address
                    </label>
                    <Field
                      as="textarea"
                      name="contact_address"
                      id="contact_address"
                      rows="3"
                      className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                bg-white border focus:border-blue-500 focus:ring-2 
                                focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                        errors.contact_address && touched.contact_address ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="contact_address" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
              </Card>
              
              {/* Social Media */}
              <Card title="Social Media">
                <div className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="social_facebook" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <AiFillFacebook className="mr-2 text-blue-600" size={20} />
                      Facebook URL
                    </label>
                    <Field
                      type="text"
                      name="social_facebook"
                      id="social_facebook"
                      placeholder="https://facebook.com/your-page"
                      className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                bg-white border focus:border-blue-500 focus:ring-2 
                                focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                        errors.social_facebook && touched.social_facebook ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="social_facebook" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="social_twitter" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <AiFillTwitterSquare className="mr-2 text-blue-400" size={20} />
                      Twitter URL
                    </label>
                    <Field
                      type="text"
                      name="social_twitter"
                      id="social_twitter"
                      placeholder="https://twitter.com/your-handle"
                      className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                bg-white border focus:border-blue-500 focus:ring-2 
                                focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                        errors.social_twitter && touched.social_twitter ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="social_twitter" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="social_instagram" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <AiFillInstagram className="mr-2 text-pink-600" size={20} />
                      Instagram URL
                    </label>
                    <Field
                      type="text"
                      name="social_instagram"
                      id="social_instagram"
                      placeholder="https://instagram.com/your-handle"
                      className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                bg-white border focus:border-blue-500 focus:ring-2 
                                focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                        errors.social_instagram && touched.social_instagram ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="social_instagram" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="social_linkedin" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <AiFillLinkedin className="mr-2 text-blue-700" size={20} />
                      LinkedIn URL
                    </label>
                    <Field
                      type="text"
                      name="social_linkedin"
                      id="social_linkedin"
                      placeholder="https://linkedin.com/company/your-company"
                      className={`w-full rounded-md border-gray-300 shadow-sm px-4 py-3 
                                bg-white border focus:border-blue-500 focus:ring-2 
                                focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${
                        errors.social_linkedin && touched.social_linkedin ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage name="social_linkedin" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || saveLoading}
                isLoading={isSubmitting || saveLoading}
              >
                <FaSave className="mr-2" />
                Save Settings
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Settings;