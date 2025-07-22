import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

const BlogCard = ({ id, title, description, likes, delay = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: 'easeOut',
        delay: delay * 0.1
      }
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-6">
        <h3 className="text-xl font-medium text-dark mb-3">{title}</h3>
        <p className="text-secondary mb-4 line-clamp-3">{description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-500">
            <FaHeart className="mr-1" />
            <span>{likes} Likes</span>
          </div>
          <Link
            to={`/blog/${id}`}
            className="text-primary font-medium hover:underline"
          >
            Read More
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;