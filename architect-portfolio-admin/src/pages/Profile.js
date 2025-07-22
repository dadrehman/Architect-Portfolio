// src/pages/Profile.js - FIXED VERSION - NO DUPLICATE SIDEBAR
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaSave, FaUserCircle, FaEnvelope, FaLock } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const profileSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  const handleUpdateProfile = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      await updateProfile(values);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleUpdatePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      await authService.updatePassword({ password: values.newPassword });
      toast.success('Password updated successfully');
      resetForm();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-medium text-secondary-800">Admin Profile</h1>
        <p className="text-secondary-500">Manage your account settings</p>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            className={`py-3 px-4 font-medium focus:outline-none ${
              activeTab === 'profile'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-secondary-500 hover:text-secondary-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button
            className={`py-3 px-4 font-medium focus:outline-none ${
              activeTab === 'password'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-secondary-500 hover:text-secondary-700'
            }`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>
      </div>
      
      {activeTab === 'profile' && (
        <Card>
          <div className="flex items-center mb-8">
            <div className="bg-primary-600 text-white rounded-full h-20 w-20 flex items-center justify-center text-3xl">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-medium">{user?.username}</h2>
              <p className="text-secondary-500">{user?.email}</p>
            </div>
          </div>
          
          <Formik
            initialValues={{
              username: user?.username || '',
              email: user?.email || '',
            }}
            validationSchema={profileSchema}
            onSubmit={handleUpdateProfile}
          >
            {({ isSubmitting, dirty }) => (
              <Form>
                <div className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="username" className="form-label flex items-center">
                      <FaUserCircle className="mr-2 text-primary-500" />
                      Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      id="username"
                      className="input-field"
                    />
                    <ErrorMessage name="username" component="div" className="error-message" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label flex items-center">
                      <FaEnvelope className="mr-2 text-primary-500" />
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="input-field"
                    />
                    <ErrorMessage name="email" component="div" className="error-message" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting || !dirty}
                      isLoading={isSubmitting}
                    >
                      <FaSave className="mr-2" />
                      Update Profile
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      )}
      
      {activeTab === 'password' && (
        <Card>
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={passwordSchema}
            onSubmit={handleUpdatePassword}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="currentPassword" className="form-label flex items-center">
                      <FaLock className="mr-2 text-primary-500" />
                      Current Password
                    </label>
                    <Field
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      className="input-field"
                    />
                    <ErrorMessage name="currentPassword" component="div" className="error-message" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword" className="form-label flex items-center">
                      <FaLock className="mr-2 text-primary-500" />
                      New Password
                    </label>
                    <Field
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      className="input-field"
                    />
                    <ErrorMessage name="newPassword" component="div" className="error-message" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label flex items-center">
                      <FaLock className="mr-2 text-primary-500" />
                      Confirm New Password
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="input-field"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
                    >
                      <FaSave className="mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      )}
    </div>
  );
};

export default Profile;