import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaHeart, FaShareAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet'; // Added Helmet import for SEO
import SectionTitle from '../components/SectionTitle';
import BlogCard from '../components/BlogCard';
import { publicService } from '../services/api';

const Blog = () => {
  const { id } = useParams(); // Get blog ID from URL (for single blog view)
  const [blogs, setBlogs] = useState([]);
  const [singleBlog, setSingleBlog] = useState(null); // For single blog view
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        if (id) {
          // Fetch single blog
          const response = await publicService.getBlogById(id);
          setSingleBlog(response.data.data);
        } else {
          // Fetch all blogs
          const response = await publicService.getAllBlogs();
          setBlogs(response.data.data);
        }
      } catch (err) {
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [id]);

  const handleLike = async (blogId) => {
    try {
      const response = await publicService.likeBlog(blogId);
      if (singleBlog) {
        setSingleBlog(response.data.data);
      } else {
        setBlogs(blogs.map(blog => blog.id === blogId ? response.data.data : blog));
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleShare = (blog) => {
    const shareUrl = `${window.location.origin}/blog/${blog.id}`;
    const shareText = `Check out this blog post: ${blog.title}`;
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareUrl);
      alert('Blog URL copied to clipboard!');
    }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (id) {
    // Single Blog View
    if (error || !singleBlog) {
      return (
        <div className="container-custom py-24 text-center">
          <p className="text-red-500 mb-4">{error || 'Blog not found.'}</p>
          <Link to="/blog" className="inline-flex items-center px-6 py-2 bg-accent text-white hover:bg-accent-dark transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Blogs
          </Link>
        </div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <section className="pt-24 pb-12 bg-neutral-100">
          <div className="container-custom">
            <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-6">
              <FaArrowLeft className="mr-2" />
              Back to Blogs
            </Link>
            <SectionTitle 
              subtitle="Blog Post" 
              title={singleBlog.title}
            />
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-12">
          <div className="container-custom">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: singleBlog.content }} />
              <div className="mt-8 flex items-center space-x-4">
                <button
                  onClick={() => handleLike(singleBlog.id)}
                  className="flex items-center text-red-500 hover:text-red-700"
                >
                  <FaHeart className="mr-2" />
                  {singleBlog.likes} Likes
                </button>
                <button
                  onClick={() => handleShare(singleBlog)}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <FaShareAlt className="mr-2" />
                  Share
                </button>
              </div>
              {/* SEO Meta Tags (for browser) */}
              <Helmet>
                <title>{singleBlog.seo_title || singleBlog.title}</title>
                <meta name="description" content={singleBlog.seo_description || singleBlog.description} />
              </Helmet>
            </div>
          </div>
        </section>
      </motion.div>
    );
  }

  // Blog List View
  return (
    <>
      <section className="pt-24 pb-16 bg-neutral-100">
        <div className="container-custom">
          <SectionTitle 
            subtitle="Our Insights" 
            title="Blog Posts" 
          />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-accent text-white hover:bg-accent-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No blog posts available.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainerVariants}
            >
              {blogs.map((blog, index) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  description={blog.description}
                  likes={blog.likes}
                  delay={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;