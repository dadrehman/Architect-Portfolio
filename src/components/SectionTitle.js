import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({ title, subtitle, alignment = 'left', light = false }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <motion.div 
      className={`mb-16 ${alignment === 'center' ? 'text-center' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
    >
      {subtitle && (
        <span className={`uppercase tracking-widest text-sm font-medium ${light ? 'text-accent' : 'text-accent'}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-display mt-3 tracking-tight ${light ? 'text-white' : 'text-primary'}`}>
        {title}
      </h2>
      <div className={`h-1 w-24 mt-6 ${alignment === 'center' ? 'mx-auto' : ''} ${light ? 'bg-white' : 'bg-accent'}`}></div>
    </motion.div>
  );
};

export default SectionTitle;