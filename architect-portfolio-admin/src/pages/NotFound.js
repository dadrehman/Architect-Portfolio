import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-accent mb-4">
          <FaExclamationTriangle size={64} className="mx-auto" />
        </div>
        <h1 className="text-3xl font-display font-semibold text-secondary-800 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-secondary-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="btn-primary flex items-center justify-center mx-auto w-full max-w-xs"
        >
          <FaHome className="mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;