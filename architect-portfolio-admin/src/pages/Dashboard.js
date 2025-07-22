import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaImages, FaComments, FaCog, FaPlus, FaBlog, FaFileAlt, FaChartLine } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { projectService, testimonialService, cvService, blogService } from '../services/api';

const StatCard = ({ title, count, icon, color, linkTo }) => (
  <Link to={linkTo} className="block">
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{count}</p>
        </div>
      </div>
    </Card>
  </Link>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    projectsCount: 0,
    testimonialsCount: 0,
    blogsCount: 0,
    cvCount: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Fetching dashboard data...');

        // Fetch all data with proper error handling
        const [projectsRes, testimonialsRes, blogsRes, cvRes] = await Promise.allSettled([
          projectService.getAll(),
          testimonialService.getAll(),
          blogService.getAll(),
          cvService.getAll()
        ]);

        // Process projects data
        let projects = [];
        if (projectsRes.status === 'fulfilled') {
          console.log('✅ Projects Response:', projectsRes.value);
          const projectData = projectsRes.value.data;
          projects = projectData?.data || projectData || [];
        } else {
          console.warn('⚠️ Projects failed:', projectsRes.reason);
        }

        // Process testimonials data
        let testimonials = [];
        if (testimonialsRes.status === 'fulfilled') {
          console.log('✅ Testimonials Response:', testimonialsRes.value);
          const testimonialData = testimonialsRes.value.data;
          testimonials = testimonialData?.data || testimonialData || [];
        } else {
          console.warn('⚠️ Testimonials failed:', testimonialsRes.reason);
        }

        // Process blogs data
        let blogs = [];
        if (blogsRes.status === 'fulfilled') {
          console.log('✅ Blogs Response:', blogsRes.value);
          const blogData = blogsRes.value.data;
          blogs = blogData?.data || blogData || [];
        } else {
          console.warn('⚠️ Blogs failed:', blogsRes.reason);
        }

        // Process CVs data
        let cvs = [];
        if (cvRes.status === 'fulfilled') {
          console.log('✅ CVs Response:', cvRes.value);
          const cvData = cvRes.value.data;
          cvs = cvData?.data || cvData || [];
        } else {
          console.warn('⚠️ CVs failed:', cvRes.reason);
        }

        // Ensure arrays
        projects = Array.isArray(projects) ? projects : [];
        testimonials = Array.isArray(testimonials) ? testimonials : [];
        blogs = Array.isArray(blogs) ? blogs : [];
        cvs = Array.isArray(cvs) ? cvs : [];

        // Update stats
        setStats({
          projectsCount: projects.length,
          testimonialsCount: testimonials.length,
          blogsCount: blogs.length,
          cvCount: cvs.length,
        });

        // Set recent projects (limit to 5)
        setRecentProjects(projects.slice(0, 5));

        console.log('📊 Dashboard stats:', {
          projects: projects.length,
          testimonials: testimonials.length,
          blogs: blogs.length,
          cvs: cvs.length
        });

      } catch (error) {
        console.error('💥 Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome to your portfolio admin panel.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Projects"
          count={stats.projectsCount}
          icon={<FaImages size={20} />}
          color="bg-blue-500"
          linkTo="/projects"
        />
        <StatCard
          title="Testimonials"
          count={stats.testimonialsCount}
          icon={<FaComments size={20} />}
          color="bg-green-500"
          linkTo="/testimonials"
        />
        <StatCard
          title="Blog Posts"
          count={stats.blogsCount}
          icon={<FaBlog size={20} />}
          color="bg-orange-500"
          linkTo="/blogs"
        />
        <StatCard
          title="CVs"
          count={stats.cvCount}
          icon={<FaFileAlt size={20} />}
          color="bg-teal-500"
          linkTo="/cv"
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-800">
              Recent Projects
            </h2>
            <Button to="/projects/new" size="sm" variant="primary">
              <FaPlus className="mr-1" />
              Add Project
            </Button>
          </div>

          <Card>
            {recentProjects.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentProjects.map((project) => (
                  <div key={project.id} className="py-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">{project.title}</h3>
                      <p className="text-sm text-gray-500">{project.category}</p>
                    </div>
                    <Button to={`/projects/edit/${project.id}`} size="sm" variant="secondary">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-gray-500 mb-4">No projects found</p>
                <Button to="/projects/new" variant="primary">
                  Add First Project
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-800">
              Quick Actions
            </h2>
          </div>

          <Card>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Add Content</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button to="/projects/new" variant="outline" className="justify-start">
                    <FaImages className="mr-2" />
                    New Project
                  </Button>
                  <Button to="/testimonials/new" variant="outline" className="justify-start">
                    <FaComments className="mr-2" />
                    New Testimonial
                  </Button>
                  <Button to="/blogs/new" variant="outline" className="justify-start">
                    <FaBlog className="mr-2" />
                    New Blog Post
                  </Button>
                  <Button to="/cv/new" variant="outline" className="justify-start">
                    <FaFileAlt className="mr-2" />
                    Upload CV
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Manage Website</h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button to="/settings" variant="outline" className="justify-start">
                    <FaCog className="mr-2" />
                    Update Site Settings
                  </Button>
                  <Button to="/analytics" variant="outline" className="justify-start">
                    <FaChartLine className="mr-2" />
                    View Analytics
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;