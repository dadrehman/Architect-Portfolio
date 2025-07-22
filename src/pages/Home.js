// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLongArrowAltRight } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import ProjectCard from '../components/ProjectCard';
import TestimonialCard from '../components/TestimonialCard';
import BlogCard from '../components/BlogCard';
import Newsletter from '../components/Newsletter';
import { createPlaceholderUrl } from '../utils/placeholderUtil';
import { useSettings } from '../context/SettingsContext';
import { publicService } from '../services/api';

const Home = () => {
  const { settings } = useSettings();
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [projectsResponse, testimonialsResponse, blogsResponse, cvResponse] = await Promise.all([
          publicService.getFeaturedProjects().catch(() => ({ data: { data: [] } })),
          publicService.getFeaturedTestimonials().catch(() => ({ data: { data: [] } })),
          publicService.getAllBlogs().catch(() => ({ data: { data: [] } })),
          publicService.getAllCVs().catch(() => ({ data: { data: [] } })),
        ]);

        setProjects(projectsResponse.data.data || []);
        setTestimonials(testimonialsResponse.data.data || []);
        setBlogs(blogsResponse.data.data ? blogsResponse.data.data.slice(0, 3) : []);
        setCV(cvResponse.data.data && cvResponse.data.data.length > 0 ? cvResponse.data.data[0] : null);
      } catch (error) {
        console.error('Home.js: Error fetching data:', error);
        setError('Unable to load some content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProjectClick = (id) => {
    if (!id) {
      console.error('Home.js: Invalid project ID');
      setError('Invalid project ID.');
      return;
    }
    console.log(`Home.js: Navigating to project with ID: ${id}`);
    navigate(`/project/${id}`);
  };

  const heroImage = createPlaceholderUrl(1920, 1080, 'Modern Architecture', '0f172a', 'ffffff');
  const aboutImage = createPlaceholderUrl(800, 600, 'Our Studio', '14151a', 'ffffff');

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <>
      <section className="h-screen relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Modern Architecture Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="container-custom relative z-10 mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl text-white"
          >
            <span className="text-accent uppercase tracking-widest text-sm font-medium mb-4 block">
              Welcome to {settings.site_title}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium mb-8 leading-tight">
              We Create <br />
              <span className="text-accent">Timeless</span> Spaces
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-xl">
              {settings.site_description ||
                'Crafting exceptional architectural experiences through innovative design, thoughtful execution, and unwavering attention to detail.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/projects" className="btn-primary">
                View Projects
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 border border-white text-white font-medium tracking-wide uppercase text-sm hover:bg-white hover:text-dark transition-all duration-300"
              >
                About Us
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="uppercase tracking-widest text-xs mb-2">Scroll Down</span>
          <motion.div
            className="w-px h-16 bg-white"
            animate={{
              scaleY: [1, 1.3, 1],
              originY: 0,
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
            }}
          ></motion.div>
        </motion.div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <span className="text-accent uppercase tracking-widest text-sm font-medium mb-4 block">
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-8 tracking-tight">
                Innovative Architecture <br />for Modern Living
              </h2>
              <p className="text-secondary mb-6 leading-relaxed">
                Architect Studio is a leading design firm specializing in creating spaces that blend
                functionality, aesthetics, and sustainability. With over 15 years of experience,
                our team of experts is dedicated to pushing the boundaries of architectural design.
              </p>
              <p className="text-secondary mb-10 leading-relaxed">
                We believe that great architecture is about more than just buildings—it's about
                creating experiences, enhancing lives, and shaping communities. Every project
                we undertake is an opportunity to create something extraordinary.
              </p>
              <Link to="/about" className="flex items-center group hover-link text-primary font-medium">
                Learn more about our studio
                <FaLongArrowAltRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={1}
            >
              <div className="relative z-10 overflow-hidden">
                <img
                  src={aboutImage}
                  alt="Our studio"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-2/3 h-24 bg-accent z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-neutral-100">
        <div className="container-custom">
          <SectionTitle
            subtitle="Our Expertise"
            title="Download Our CV"
            alignment="center"
          />

          <motion.div
            className="text-center mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : cv ? (
              <div>
                <p className="text-secondary mb-6 max-w-2xl mx-auto">
                  Get to know more about our expertise, experience, and achievements by downloading our CV.
                </p>
                <a
                  href={`https://api.architectshahab.site${cv.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block"
                >
                  View & Download CV
                </a>
              </div>
            ) : (
              <p className="text-secondary-500">
                No CV available at the moment. Please check back later or contact us.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-neutral-100">
        <div className="container-custom">
          <SectionTitle
            subtitle="Selected Work"
            title="Featured Projects"
            alignment="center"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : projects.length > 0 ? (
              projects.map((project, index) => (
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
                        : createPlaceholderUrl(800, 600, project.title, '14151a', 'ffffff')
                    }
                    title={project.title}
                    category={project.category}
                    delay={index}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-secondary-500">
                  No featured projects available at the moment. Explore our portfolio for more.
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            className="text-center mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <Link to="/projects" className="btn-outline">
              View All Projects
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle
            subtitle="What We Offer"
            title="Our Services"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            <ServiceCard
              number="01"
              title="Residential Design"
              description="Creating beautiful, functional homes tailored to your lifestyle and preferences, from urban apartments to luxury villas."
              delay={0}
            />
            <ServiceCard
              number="02"
              title="Commercial Architecture"
              description="Designing innovative workspaces and commercial buildings that enhance productivity, reflect brand values, and inspire clients."
              delay={1}
            />
            <ServiceCard
              number="03"
              title="Interior Design"
              description="Crafting interior spaces that perfectly balance aesthetics, functionality, and comfort, with meticulous attention to detail."
              delay={2}
            />
            <ServiceCard
              number="04"
              title="Urban Planning"
              description="Developing comprehensive urban plans that create harmonious, sustainable, and vibrant community spaces."
              delay={3}
            />
            <ServiceCard
              number="05"
              title="Sustainable Design"
              description="Integrating eco-friendly practices and materials to create buildings that minimize environmental impact and maximize efficiency."
              delay={4}
            />
            <ServiceCard
              number="06"
              title="Renovation & Restoration"
              description="Breathing new life into existing structures while respecting their historical significance and architectural integrity."
              delay={5}
            />
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-neutral-100">
        <div className="container-custom">
          <SectionTitle
            subtitle="Latest Insights"
            title="Our Blog"
            alignment="center"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  description={blog.description}
                  likes={blog.likes}
                  delay={index}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-secondary-500">
                  No blog posts available at the moment. Stay tuned for updates.
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            className="text-center mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <Link to="/blog" className="btn-outline">
              View All Blogs
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-neutral-100">
        <div className="container-custom">
          <SectionTitle
            subtitle="Client Feedback"
            title="What Our Clients Say"
            alignment="center"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  quote={testimonial.quote}
                  author={testimonial.client_name}
                  position={testimonial.position}
                  company={testimonial.company}
                  image={
                    testimonial.image
                      ? `https://api.architectshahab.site${testimonial.image}`
                      : createPlaceholderUrl(400, 400, testimonial.client_name, 'ffffff', '333333')
                  }
                  delay={index}
                  rating={testimonial.rating || 5}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-secondary-500">
                  No featured testimonials available at the moment.
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            className="text-center mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <Link to="/testimonials" className="btn-outline">
              View All Testimonials
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle
            subtitle="Stay Updated"
            title="Subscribe to Our Newsletter"
            alignment="center"
          />

          <motion.div
            className="max-w-md mx-auto mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <Newsletter />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-primary text-white">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-6 tracking-tight">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-secondary mb-10 max-w-2xl mx-auto">
              Let's collaborate to bring your architectural vision to life. Our team is ready to
              create a design that perfectly aligns with your needs and aspirations.
            </p>
            <Link to="/contact" className="btn-primary">
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const ServiceCard = ({ number, title, description, delay = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: delay * 0.1,
      },
    },
  };

  return (
    <motion.div
      className="group p-8 border border-neutral-200 hover:border-accent transition-colors duration-300"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={cardVariants}
    >
      <span className="text-accent text-4xl font-display opacity-50 block mb-4">{number}</span>
      <h3 className="text-xl font-medium mb-4 group-hover:text-accent transition-colors duration-300">{title}</h3>
      <p className="text-secondary">{description}</p>
    </motion.div>
  );
};

export default Home;