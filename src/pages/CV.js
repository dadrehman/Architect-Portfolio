import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import { publicService } from '../services/api';

const CV = () => {
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCV = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await publicService.getAllCVs();
        setCV(response.data.data[0] || null); // Get the first CV
      } catch (err) {
        setError('Failed to load CV. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !cv) {
    return (
      <div className="container-custom py-24 text-center">
        <p className="text-red-500 mb-4">{error || 'No CV available.'}</p>
        <Link to="/" className="inline-flex items-center px-6 py-2 bg-accent text-white hover:bg-accent-dark transition-colors">
          <FaArrowLeft className="mr-2" />
          Back to Home
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
          <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <SectionTitle 
            subtitle="Our Expertise" 
            title={cv.title || "Our CV"}
          />
        </div>
      </section>

      {/* CV Preview Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium text-dark">{cv.title}</h2>
              <a
                href={`https://api.architectshahab.site${cv.file_path}`}
                download
                className="btn-primary inline-flex items-center"
              >
                <FaDownload className="mr-2" />
                Download CV
              </a>
            </div>
            <div className="w-full h-[600px] border border-neutral-200 rounded-lg">
              <iframe
                src={`https://api.architectshahab.site${cv.file_path}`}
                title="CV Preview"
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default CV;