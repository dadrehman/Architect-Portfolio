// src/App.js - FINAL FIXED VERSION - NO DUPLICATE LAYOUTS
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/ProjectsList';
import ProjectForm from './pages/ProjectForm';
import TestimonialsList from './pages/TestimonialsList';
import TestimonialForm from './pages/TestimonialForm';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ManageCV from './pages/ManageCV';
import AddEditCV from './pages/AddEditCV';
import ManageBlogs from './pages/ManageBlogs';
import AddEditBlog from './pages/AddEditBlog';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <Router basename="/">
      <div className="App">
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          {/* Login Route - NO LAYOUT */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes - SINGLE LAYOUT WRAPPER */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    {/* Dashboard Routes */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Projects Routes */}
                    <Route path="/projects" element={<ProjectsList />} />
                    <Route path="/projects/new" element={<ProjectForm />} />
                    <Route path="/projects/edit/:id" element={<ProjectForm />} />
                    
                    {/* Testimonials Routes */}
                    <Route path="/testimonials" element={<TestimonialsList />} />
                    <Route path="/testimonials/new" element={<TestimonialForm />} />
                    <Route path="/testimonials/edit/:id" element={<TestimonialForm />} />
                    
                    {/* CV Routes */}
                    <Route path="/cv" element={<ManageCV />} />
                    <Route path="/cv/new" element={<AddEditCV />} />
                    <Route path="/cv/edit/:id" element={<AddEditCV />} />
                    
                    {/* Blog Routes */}
                    <Route path="/blogs" element={<ManageBlogs />} />
                    <Route path="/blogs/new" element={<AddEditBlog />} />
                    <Route path="/blogs/edit/:id" element={<AddEditBlog />} />
                    
                    {/* Other Routes */}
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;