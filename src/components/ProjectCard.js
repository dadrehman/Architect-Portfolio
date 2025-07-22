// src/components/ProjectCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

const ProjectCard = ({ image, title, category, delay = 0, id }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: 'easeOut',
        delay: delay * 0.1
      }
    }
  };

  // Generate a fallback image if none provided
  const defaultImage = `https://via.placeholder.com/800x600/14151a/ffffff?text=${encodeURIComponent(title || 'Project')}`;

  return (
    <motion.div 
      className="group"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={cardVariants}
    >
      <Link to={`/projects/${id || title?.toLowerCase().replace(/\s+/g, '-')}`} className="block">
        <div className="overflow-hidden relative">
          <img 
            src={image || defaultImage} 
            alt={title} 
            className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-accent uppercase text-sm tracking-wide font-medium block mb-2">{category || 'Project'}</span>
                  <h3 className="text-white text-2xl font-display">{title || 'Untitled Project'}</h3>
                </div>
                <div className="bg-accent text-primary p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <HiArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;