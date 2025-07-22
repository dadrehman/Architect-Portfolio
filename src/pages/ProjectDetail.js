// src/pages/ProjectDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { publicService } from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`ProjectDetail.js: Fetching project with ID: ${id}`);
        const response = await publicService.getProject(id);
        console.log('ProjectDetail.js: Project fetch response:', response);
        if (response.data && response.data.data) {
          setProject(response.data.data);
        } else {
          setError('Project data not found.');
        }
      } catch (err) {
        console.error('ProjectDetail.js: Error fetching project:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id && !isNaN(id)) {
      fetchProject();
    } else {
      setError('Invalid project ID.');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container-custom py-24 text-center">
        <p className="text-red-500 mb-4">{error || 'Project not found.'}</p>
        <Link
          to="/projects"
          className="inline-flex items-center px-6 py-2 bg-accent text-white hover:bg-accent-dark transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Projects
        </Link>
      </div>
    );
  }

  const galleryImages = Array.isArray(project.gallery)
    ? project.gallery
    : typeof project.gallery === 'string'
    ? JSON.parse(project.gallery)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="pt-24 pb-12 bg-neutral-100">
        <div className="container-custom">
          <Link
            to="/projects"
            className="inline-flex items-center text-primary hover:underline mb-6"
          >
            <FaArrowLeft className="mr-2" />
            Back to Projects
          </Link>
          <h1 className="text-4xl font-display font-medium text-dark mb-4">{project.title}</h1>
          <div className="flex flex-wrap gap-4 text-secondary-500">
            <span>{project.category}</span>
            <span>{project.year || 'N/A'}</span>
            <span>{project.location || 'N/A'}</span>
          </div>
        </div>
      </section>

      {project.image_main && (
        <section className="py-12">
          <div className="container-custom">
            <img
              src={`https://api.architectshahab.site${project.image_main}`}
              alt={project.title}
              className="w-full h-auto object-cover rounded-lg shadow-md project-main-image"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found')}
            />
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 project-details-meta">
              <h2 className="text-2xl font-medium text-dark mb-6">Project Details</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-secondary-500 uppercase">Client</h3>
                  <p className="text-dark">{project.client || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-secondary-500 uppercase">Category</h3>
                  <p className="text-dark">{project.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-secondary-500 uppercase">Year</h3>
                  <p className="text-dark">{project.year || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-secondary-500 uppercase">Location</h3>
                  <p className="text-dark">{project.location || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 project-description">
              <h2 className="text-2xl font-medium text-dark mb-6">About the Project</h2>
              <p className="text-secondary leading-relaxed description-text">
                {project.description || 'No description available.'}
              </p>

              {galleryImages.length > 0 && (
                <div className="mt-12 project-gallery">
                  <h2 className="text-2xl font-medium text-dark mb-6">Project Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {galleryImages.map((image, index) => (
                      <img
                        key={index}
                        src={`https://api.architectshahab.site${image}`}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-auto object-cover rounded-lg shadow-md gallery-image"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found')}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProjectDetail;