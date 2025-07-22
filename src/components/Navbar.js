import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-soft py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-display font-medium text-dark tracking-tight">
            ARCHITECT
            <span className="text-accent">STUDIO</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-dark focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-10">
            <NavLink to="/" current={location.pathname === "/"}>Home</NavLink>
            <NavLink to="/about" current={location.pathname === "/about"}>About</NavLink>
            <NavLink to="/projects" current={location.pathname === "/projects"}>Projects</NavLink>
            <NavLink to="/testimonials" current={location.pathname === "/testimonials"}>Testimonials</NavLink>
            <NavLink to="/contact" current={location.pathname === "/contact"}>Contact</NavLink>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              className="md:hidden mt-4 py-4 bg-white"
            >
              <div className="flex flex-col space-y-4">
                <MobileNavLink to="/" current={location.pathname === "/"}>Home</MobileNavLink>
                <MobileNavLink to="/about" current={location.pathname === "/about"}>About</MobileNavLink>
                <MobileNavLink to="/projects" current={location.pathname === "/projects"}>Projects</MobileNavLink>
                <MobileNavLink to="/testimonials" current={location.pathname === "/testimonials"}>Testimonials</MobileNavLink>
                <MobileNavLink to="/contact" current={location.pathname === "/contact"}>Contact</MobileNavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

// Helper component for desktop navigation links
const NavLink = ({ to, current, children }) => (
  <Link
    to={to}
    className={`font-medium tracking-wide text-sm uppercase hover-link ${
      current ? 'text-accent after:w-full' : 'text-dark'
    }`}
  >
    {children}
  </Link>
);

// Helper component for mobile navigation links
const MobileNavLink = ({ to, current, children }) => (
  <Link
    to={to}
    className={`font-medium tracking-wide text-sm uppercase py-2 block ${
      current ? 'text-accent' : 'text-dark'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;