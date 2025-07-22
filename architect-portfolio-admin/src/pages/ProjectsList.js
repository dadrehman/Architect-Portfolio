// src/pages/ProjectsList.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { projectService } from '../services/api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching projects and categories...');
        
        const [projectsRes, categoriesRes] = await Promise.allSettled([
          projectService.getAll(),
          projectService.getCategories()
        ]);
        
        // Handle projects response
        let projectsData = [];
        if (projectsRes.status === 'fulfilled') {
          console.log('✅ Projects Response:', projectsRes.value);
          const response = projectsRes.value;
          
          // Handle different response structures
          if (response?.data?.data) {
            projectsData = response.data.data;
          } else if (response?.data && Array.isArray(response.data)) {
            projectsData = response.data;
          } else if (Array.isArray(response)) {
            projectsData = response;
          }
        } else {
          console.warn('⚠️ Projects fetch failed:', projectsRes.reason);
        }
        
        // Handle categories response
        let categoriesData = [];
        if (categoriesRes.status === 'fulfilled') {
          console.log('✅ Categories Response:', categoriesRes.value);
          const response = categoriesRes.value;
          
          // Handle different response structures
          if (response?.data?.data) {
            categoriesData = response.data.data;
          } else if (response?.data && Array.isArray(response.data)) {
            categoriesData = response.data;
          } else if (Array.isArray(response)) {
            categoriesData = response;
          }
        } else {
          console.warn('⚠️ Categories fetch failed:', categoriesRes.reason);
        }
        
        // Ensure arrays
        projectsData = Array.isArray(projectsData) ? projectsData : [];
        categoriesData = Array.isArray(categoriesData) ? categoriesData : [];
        
        // Extract unique categories from projects if categories request failed
        if (categoriesData.length === 0 && projectsData.length > 0) {
          categoriesData = [...new Set(projectsData.map(p => p.category).filter(Boolean))];
        }
        
        setProjects(projectsData);
        setCategories(['all', ...categoriesData]);
        
        console.log('📊 Loaded:', {
          projects: projectsData.length,
          categories: categoriesData.length
        });
        
      } catch (error) {
        console.error('💥 Error fetching data:', error);
        setError('Failed to load projects. Please try again.');
        toast.error('Failed to load projects');
        
        // Set empty arrays to prevent crashes
        setProjects([]);
        setCategories(['all']);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.delete(id);
        setProjects(projects.filter(project => project.id !== id));
        toast.success('Project deleted successfully');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const handleToggleFeatured = async (id, featured) => {
    try {
      const project = projects.find(p => p.id === id);
      if (!project) {
        toast.error('Project not found');
        return;
      }
      
      await projectService.update(id, { ...project, featured: !featured });
      
      setProjects(projects.map(p => 
        p.id === id ? { ...p, featured: !p.featured } : p
      ));
      
      toast.success(`Project ${featured ? 'unfeatured' : 'featured'} successfully`);
    } catch (error) {
      console.error('Error updating project featured status:', error);
      toast.error('Failed to update project');
    }
  };

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Projects</h1>
            <p className="text-gray-500">Manage your portfolio projects</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/projects/new">
              <Button variant="primary">
                <FaPlus className="mr-2" />
                Add New Project
              </Button>
            </Link>
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
            <h1 className="text-2xl font-medium text-gray-800">Projects</h1>
            <p className="text-gray-500">Manage your portfolio projects</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/projects/new">
              <Button variant="primary">
                <FaPlus className="mr-2" />
                Add New Project
              </Button>
            </Link>
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
          <h1 className="text-2xl font-medium text-gray-800">Projects</h1>
          <p className="text-gray-500">Manage your portfolio projects</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/projects/new">
            <Button variant="primary">
              <FaPlus className="mr-2" />
              Add New Project
            </Button>
          </Link>
        </div>
      </div>
      
      {categories.length > 1 && (
        <Card className="mb-6">
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category:
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    
      <Card>
        {filteredProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
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
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {project.image_main ? (
                          <img 
                            src={project.image_main.startsWith('http') 
                              ? project.image_main 
                              : `https://api.architectshahab.site${project.image_main}`
                            } 
                            alt={project.title}
                            className="h-10 w-10 rounded-md object-cover mr-3"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center mr-3" 
                             style={{ display: project.image_main ? 'none' : 'flex' }}>
                          <span className="text-gray-400 text-xs">IMG</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{project.title}</div>
                          <div className="text-sm text-gray-500">{project.year || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(project.id, project.featured)}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                        title={project.featured ? "Remove from featured" : "Add to featured"}
                      >
                        {project.featured ? <FaStar size={18} /> : <FaRegStar size={18} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Link 
                          to={`/projects/edit/${project.id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit project"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete project"
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
            <p className="text-gray-500 mb-4">
              {selectedCategory === 'all' ? 'No projects found' : `No projects found in "${selectedCategory}" category`}
            </p>
            <Link to="/projects/new">
              <Button variant="primary">
                <FaPlus className="mr-2" />
                Add First Project
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProjectsList;