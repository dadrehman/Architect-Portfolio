// src/components/TestimonialCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const TestimonialCard = ({ quote, author, position, company, image, rating = 5, delay = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: 'easeOut',
        delay: delay * 0.2
      }
    }
  };

  // Generate a fallback image if needed
  const defaultImage = `https://via.placeholder.com/150/f4f4f5/333333?text=${author ? author.charAt(0) : 'C'}`;

  return (
    <motion.div 
      className="bg-white p-8 md:p-10 shadow-soft border border-neutral-200"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={cardVariants}
    >
      <FaQuoteLeft className="text-accent mb-6" size={36} />
      <p className="text-lg font-serif italic mb-8 text-neutral-800">"{quote || 'No testimonial provided'}"</p>
      
      {/* Star Rating */}
      <div className="flex mb-4">
        {Array(rating).fill().map((_, i) => (
          <span key={i} className="text-accent">★</span>
        ))}
        {Array(5 - rating).fill().map((_, i) => (
          <span key={i} className="text-neutral-300">★</span>
        ))}
      </div>
      
      <div className="flex items-center">
        {image ? (
          <img 
            src={image} 
            alt={author} 
            className="w-14 h-14 rounded-full object-cover mr-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center mr-4">
            <span className="text-neutral-700 font-medium text-xl">
              {author ? author.charAt(0) : 'C'}
            </span>
          </div>
        )}
        <div>
          <h4 className="text-lg font-medium">{author || 'Anonymous'}</h4>
          <p className="text-secondary">{position || 'Client'}{company ? `, ${company}` : ''}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;