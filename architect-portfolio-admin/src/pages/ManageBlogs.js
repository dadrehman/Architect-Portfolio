// src/pages/ManageBlogs.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaBlog } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { blogService } from '../services/api';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching blogs...');
        
        const response = await blogService.getAll();
        console.log('✅ Blogs Response:', response);
        
        // Handle different response structures
        let blogsData = [];
        if (response?.data?.data) {
          blogsData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          blogsData = response.data;
        } else if (Array.isArray(response)) {
          blogsData = response;
        }
        
        // Ensure it's an array
        blogsData = Array.isArray(blogsData) ? blogsData : [];
        
        setBlogs(blogsData);
        
        console.log('📊 Loaded blogs:', blogsData.length);
        
      } catch (error) {
        console.error('💥 Error fetching blogs:', error);
        setError('Failed to load blogs. Please try again.');
        toast.error('Failed to load blogs');
        
        // Set empty array to prevent crashes
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.delete(id);
        setBlogs(blogs.filter(blog => blog.id !== id));
        toast.success('Blog deleted successfully');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Manage Blogs</h1>
            <p className="text-gray-500">Create and manage blog posts for your portfolio.</p>
          </div>
          <Link to="/blogs/new">
            <Button variant="primary">
              <FaPlus className="mr-2" />
              Add Blog Post
            </Button>
          </Link>
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Manage Blogs</h1>
            <p className="text-gray-500">Create and manage blog posts for your portfolio.</p>
          </div>
          <Link to="/blogs/new">
            <Button variant="primary">
              <FaPlus className="mr-2" />
              Add Blog Post
            </Button>
          </Link>
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">Manage Blogs</h1>
          <p className="text-gray-500">Create and manage blog posts for your portfolio.</p>
        </div>
        <Link to="/blogs/new">
          <Button variant="primary">
            <FaPlus className="mr-2" />
            Add Blog Post
          </Button>
        </Link>
      </div>

      <Card>
        {blogs.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {blogs.map(blog => (
              <div key={blog.id} className="py-4 flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{blog.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{blog.description}</p>
                  {blog.created_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Link to={`/blogs/edit/${blog.id}`}>
                    <Button variant="secondary" size="sm">
                      <FaEdit className="mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(blog.id)}
                  >
                    <FaTrash className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <FaBlog className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No blog posts found.</p>
            <Link to="/blogs/new">
              <Button variant="primary">
                <FaPlus className="mr-2" />
                Add First Blog Post
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ManageBlogs;