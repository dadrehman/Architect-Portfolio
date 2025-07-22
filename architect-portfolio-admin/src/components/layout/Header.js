import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-lg md:text-xl font-display text-secondary-800">
            Admin Dashboard
          </h1>
          
          <div className="flex items-center">
            <div className="hidden md:flex items-center">
              <div className="ml-3 relative">
                <div>
                  <Link to="/profile" className="flex items-center">
                    <div className="bg-primary-600 rounded-full h-8 w-8 flex items-center justify-center text-white">
                      {user?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <span className="ml-2 text-sm text-secondary-700">{user?.username || 'Admin'}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;