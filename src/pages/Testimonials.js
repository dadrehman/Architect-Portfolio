import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import TestimonialCard from '../components/TestimonialCard';
import { publicService } from '../services/api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await publicService.getTestimonials();
        
        const testimonialsData = response.data.data || [];
        setTestimonials(testimonialsData);
      } catch (err) {
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);

  const featuredTestimonial = testimonials.length > 0 
    ? testimonials.find(t => t.featured) || testimonials[0] 
    : null;

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      <section className="pt-32 pb-16 bg-neutral-100">
        <div className="container-custom">
          <SectionTitle 
            subtitle="Client Feedback" 
            title="What Our Clients Say" 
          />
          <p className="text-secondary max-w-2xl mt-8">
            We pride ourselves on building strong relationships with our clients. Here's what some of them have to say about their experience working with Architect Studio.
          </p>
        </div>
      </section>

      {!loading && !error && featuredTestimonial && (
        <section className="py-20 bg-primary text-white">
          <div className="container-custom">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <FaQuoteLeft className="text-accent mx-auto mb-8" size={48} />
              <p className="text-2xl md:text-3xl font-serif italic mb-10 leading-relaxed">
                "{featuredTestimonial.quote}"
              </p>
              <div className="flex items-center justify-center">
                <img 
                  src={featuredTestimonial.image 
                    ? `${process.env.REACT_APP_API_URL || 'https://api.architectshahab.site'}${featuredTestimonial.image}` 
                    : '/placeholder-avatar.png'}
                  alt={featuredTestimonial.client_name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div className="text-left">
                  <h4 className="text-lg font-medium">{featuredTestimonial.client_name}</h4>
                  <p className="text-secondary">{featuredTestimonial.position}, {featuredTestimonial.company}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

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
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No testimonials found.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainerVariants}
            >
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={testimonial.id}
                  quote={testimonial.quote}
                  author={testimonial.client_name}
                  position={testimonial.position}
                  company={testimonial.company}
                  image={testimonial.image 
                    ? `${process.env.REACT_APP_API_URL || 'https://api.architectshahab.site'}${testimonial.image}` 
                    : null}
                  rating={testimonial.rating || 5}
                  delay={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-20 bg-neutral-100">
        <div className="container-custom">
          <h3 className="text-2xl font-display text-center mb-12">
            Trusted by Leading Organizations
          </h3>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className="h-16 bg-white rounded shadow-soft flex items-center justify-center p-4"
                variants={fadeInUpVariants}
                custom={index}
              >
                <div className="text-neutral-300 font-medium text-center">Client Logo {index + 1}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-accent text-dark">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-6 tracking-tight">
              Ready to Join Our Satisfied Clients?
            </h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto opacity-90">
              Let's start a conversation about your architectural vision. We're excited to hear about your project and show you how we can bring your ideas to life.
            </p>
            <a href="/contact" className="px-8 py-3 bg-primary text-white font-medium tracking-wide uppercase text-sm hover:bg-neutral-800 transition-all duration-300">
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;