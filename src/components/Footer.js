import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPinterest, FaBehance } from 'react-icons/fa';
import { useSettings } from '../context/SettingsContext'; // Added useSettings

const Footer = () => {
  const { settings } = useSettings(); // Added to fetch settings

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom">
        {/* Top Footer Section */}
        <div className="pt-20 pb-16 border-b border-neutral-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <h3 className="text-2xl font-display mb-8 heading-line">{settings.site_title || 'Architect Studio'}</h3>
              <p className="text-secondary mb-6 leading-relaxed">
                {settings.site_description || 'Creating beautiful, functional architectural designs that transform spaces and elevate experiences.'}
              </p>
              <div className="flex space-x-4 mt-6">
                {settings.social_facebook && <SocialIcon icon={<FaFacebook />} link={settings.social_facebook} />}
                {settings.social_twitter && <SocialIcon icon={<FaTwitter />} link={settings.social_twitter} />}
                {settings.social_instagram && <SocialIcon icon={<FaInstagram />} link={settings.social_instagram} />}
                {settings.social_linkedin && <SocialIcon icon={<FaLinkedin />} link={settings.social_linkedin} />}
                <SocialIcon icon={<FaPinterest />} />
                <SocialIcon icon={<FaBehance />} />
              </div>
            </motion.div>
            
            {/* Quick Links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={1}
            >
              <h3 className="text-xl font-display mb-8 heading-line">Navigation</h3>
              <ul className="space-y-4">
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/projects">Our Projects</FooterLink>
                <FooterLink to="/testimonials">Testimonials</FooterLink>
                <FooterLink to="/contact">Contact</FooterLink>
              </ul>
            </motion.div>
            
            {/* Services */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={2}
            >
              <h3 className="text-xl font-display mb-8 heading-line">Services</h3>
              <ul className="space-y-4">
                <FooterLink to="#">Residential Design</FooterLink>
                <FooterLink to="#">Commercial Projects</FooterLink>
                <FooterLink to="#">Interior Design</FooterLink>
                <FooterLink to="#">Landscape Architecture</FooterLink>
                <FooterLink to="#">Sustainable Design</FooterLink>
              </ul>
            </motion.div>
            
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={3}
            >
              <h3 className="text-xl font-display mb-8 heading-line">Contact Us</h3>
              <ul className="space-y-4 text-secondary">
                <li className="flex items-start">
                  <span className="inline-block w-24 text-sm uppercase tracking-wide text-accent">Address:</span>
                  <span>{settings.contact_address || '123 Architecture St. New York, NY 10001'}</span>
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-24 text-sm uppercase tracking-wide text-accent">Email:</span>
                  <a href={`mailto:${settings.contact_email || 'info@architectstudio.com'}`} className="hover-link">
                    {settings.contact_email || 'info@architectstudio.com'}
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-24 text-sm uppercase tracking-wide text-accent">Phone:</span>
                  <a href={`tel:${settings.contact_phone || '+1234567890'}`} className="hover-link">
                    {settings.contact_phone || '(123) 456-7890'}
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom Footer Section */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center text-secondary text-sm">
          <p>&copy; {new Date().getFullYear()} {settings.site_title || 'Architect Studio'}. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="#" className="hover-link">Privacy Policy</Link>
            <Link to="#" className="hover-link">Terms of Service</Link>
            <Link to="#" className="hover-link">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper component for footer links
const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-secondary hover-link">
      {children}
    </Link>
  </li>
);

// Helper component for social icons
const SocialIcon = ({ icon, link = '#' }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-secondary hover:border-accent hover:text-accent transition-colors duration-300">
    {icon}
  </a>
);

export default Footer;