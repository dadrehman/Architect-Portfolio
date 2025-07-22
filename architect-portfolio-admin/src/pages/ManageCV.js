// src/pages/ManageCV.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaDownload, FaFileAlt } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { cvService } from '../services/api';

const ManageCV = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching CVs...');
        
        const response = await cvService.getAll();
        console.log('✅ CVs Response:', response);
        
        // Handle different response structures
        let cvsData = [];
        if (response?.data?.data) {
          cvsData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          cvsData = response.data;
        } else if (Array.isArray(response)) {
          cvsData = response;
        }
        
        // Ensure it's an array
        cvsData = Array.isArray(cvsData) ? cvsData : [];
        
        setCvs(cvsData);
        
        console.log('📊 Loaded CVs:', cvsData.length);
        
      } catch (error) {
        console.error('💥 Error fetching CVs:', error);
        setError('Failed to load CVs. Please try again.');
        toast.error('Failed to load CVs');
        
        // Set empty array to prevent crashes
        setCvs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCVs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      try {
        await cvService.delete(id);
        setCvs(cvs.filter(cv => cv.id !== id));
        toast.success('CV deleted successfully');
      } catch (error) {
        console.error('Error deleting CV:', error);
        toast.error('Failed to delete CV');
      }
    }
  };

  const handleDownload = (cv) => {
    // For mock data, show a message
    if (cv.file_path && cv.file_path.includes('mock-')) {
      toast.info('This is a demo CV file. In a real application, the file would be downloaded.');
      return;
    }
    
    // For real files, create download link
    const downloadUrl = cv.file_path.startsWith('http') 
      ? cv.file_path 
      : `https://api.architectshahab.site${cv.file_path}`;
      
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${cv.title || 'CV'}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Manage CVs</h1>
            <p className="text-gray-500">Upload and manage your curriculum vitae documents.</p>
          </div>
          <Link to="/cv/new">
            <Button variant="primary">
              <FaPlus className="mr-2" />
              Upload CV
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
            <h1 className="text-2xl font-medium text-gray-800">Manage CVs</h1>
            <p className="text-gray-500">Upload and manage your curriculum vitae documents.</p>
          </div>
          <Link to="/cv/new">
            <Button variant="primary">
              <FaPlus className="mr-2" />
              Upload CV
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
          <h1 className="text-2xl font-medium text-gray-800">Manage CVs</h1>
          <p className="text-gray-500">Upload and manage your curriculum vitae documents.</p>
        </div>
        <Link to="/cv/new">
          <Button variant="primary">
            <FaPlus className="mr-2" />
            Upload CV
          </Button>
        </Link>
      </div>

      <Card>
        {cvs.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {cvs.map(cv => (
              <div key={cv.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-lg mr-4">
                    <FaFileAlt className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{cv.title}</h3>
                    <p className="text-sm text-gray-500">
                      Uploaded: {cv.created_at ? new Date(cv.created_at).toLocaleDateString() : 'Unknown date'}
                    </p>
                    {cv.file_path && (
                      <p className="text-sm text-gray-400">
                        File: {cv.file_path.split('/').pop()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(cv)}
                    title="Download CV"
                  >
                    <FaDownload className="mr-1" />
                    Download
                  </Button>
                  <Link to={`/cv/edit/${cv.id}`}>
                    <Button variant="secondary" size="sm">
                      <FaEdit className="mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(cv.id)}
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
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No CVs found.</p>
            <Link to="/cv/new">
              <Button variant="primary">
                <FaPlus className="mr-2" />
                Upload First CV
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">CV Management Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Upload PDF files for best compatibility</li>
            <li>• Use descriptive titles for easy identification</li>
            <li>• Keep multiple versions for different purposes</li>
            <li>• Regular updates ensure current information</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default ManageCV;