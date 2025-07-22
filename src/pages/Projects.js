// src/pages/Projects.js
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import SectionTitle from '../components/SectionTitle';
import { publicService } from '../services/api';
import { createPlaceholderUrl } from '../utils/placeholderUtil';

const Projects = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const [projectsRes, categoriesRes] = await Promise.all([
          publicService.getProjects().catch(() => ({ data: { data: [] } })),
          publicService.getProjectCategories().catch(() => ({ data: { data: [] } })),
        ]);

        const projectsData = projectsRes.data.data || [];
        const categoriesList = categoriesRes.data.data || [];

        setAllProjects(projectsData);
        setFilteredProjects(projectsData);
        setCategories(['All', ...categoriesList]);
      } catch (err) {
        console.error('Projects.js: Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilterChange = (category) => {
    setActiveFilter(category);
    if (category === 'All') {
      setFilteredProjects(allProjects);
    } else {
      const filtered = allProjects.filter((project) => project.category === category);
      setFilteredProjects(filtered);
    }
  };

  const handleProjectClick = (id) => {
    if (!id || isNaN(id)) {
      console.error('Projects.js: Invalid project ID:', id);
      setError('Invalid project ID.');
      return;
    }
    console.log(`Projects.js: Navigating to project with ID: ${id}`);
    navigate(`/project/${id}`);
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <section className="pt-32 pb-16 bg-neutral-100">
        <div className="container-custom">
          <SectionTitle subtitle="Our Work" title="Projects Portfolio" />
        </div>
      </section>

      <section className="py-12 border-b border-neutral-200">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                onClick={() => handleFilterChange(category)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeFilter === category
                    ? 'bg-accent text-white shadow-md'
                    : 'bg-white text-dark hover:bg-neutral-100 border border-neutral-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-accent text-white hover:bg-accent-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects found in this category.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainerVariants}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ProjectCard
                    image={
                      project.image_main
                        ? `https://api.architectshahab.site${project.image_main}`
                        : createPlaceholderUrl(800, 600, project.title || 'Project', '14151a', 'ffffff')
                    }
                    title={project.title}
                    category={project.category}
                    delay={index}
                    id={project.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="section-padding bg-neutral-100">
        <div className="container-custom">
          <SectionTitle
            subtitle="Our Approach"
            title="Design Process"
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <ProcessStep
              number="01"
              title="Consultation"
              description="We begin by understanding your vision, requirements, and constraints to establish a solid foundation for the project."
              delay={0}
            />
            <ProcessStep
              number="02"
              title="Concept Design"
              description="Our team develops initial design concepts that align with your goals, presenting multiple options for your consideration."
              delay={1}
            />
            <ProcessStep
              number="03"
              title="Development"
              description="The chosen concept is refined and developed in detail, incorporating feedback and making technical adjustments."
              delay={2}
            />
            <ProcessStep
              number="04"
              title="Implementation"
              description="We oversee the construction or implementation phase, ensuring the design is executed according to specifications."
              delay={3}
            />
          </div>
        </div>
      </section>
    </>
  );
};

const ProcessStep = ({ number, title, description, delay = 0 }) => {
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: delay * 0.2,
      },
    },
  };

  return (
    <motion.div
      className="text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stepVariants}
    >
      <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
        <span className="text-dark font-medium">{number}</span>
      </div>
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      <p className="text-secondary">{description}</p>
    </motion.div>
  );
};

export default Projects;