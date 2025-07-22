import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import CV from './pages/CV'; // Added CV page
import Blog from './pages/Blog'; // Added Blog page

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { publicService } from './services/api';

// AppWrapper to handle settings fetch and CSS variables
const AppWrapper = () => {
  const { settings, setSettings } = useSettings();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await publicService.getSettings();
        if (response && response.data && response.data.data) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, [setSettings]);

  // Set CSS variables for colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', settings.theme_primary_color);
    root.style.setProperty('--accent-color', settings.theme_accent_color);
  }, [settings.theme_primary_color, settings.theme_accent_color]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cv" element={<CV />} /> {/* Added CV route */}
          <Route path="/blog" element={<Blog />} /> {/* Added Blog route */}
          <Route path="/blog/:id" element={<Blog />} /> {/* Added route for single blog */}
        </Routes>
      </motion.main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <SettingsProvider>
        <AppWrapper />
      </SettingsProvider>
    </Router>
  );
}

export default App;