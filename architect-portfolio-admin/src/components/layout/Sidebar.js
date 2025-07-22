// src/components/layout/Sidebar.js - FIXED ROUTING
import React, { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaImages, 
  FaComments, 
  FaCog, 
  FaUser,
  FaFileAlt,
  FaBlog,
  FaChartLine
} from 'react-icons/fa';

const Sidebar = forwardRef(({ isOpen, toggleSidebar }, ref) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { path: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/projects', icon: <FaImages />, label: 'Projects' },
    { path: '/testimonials', icon: <FaComments />, label: 'Testimonials' },
    { path: '/cv', icon: <FaFileAlt />, label: 'CV' },
    { path: '/blogs', icon: <FaBlog />, label: 'Blogs' },
    { path: '/analytics', icon: <FaChartLine />, label: 'Analytics' },
    { path: '/settings', icon: <FaCog />, label: 'Settings' },
    { path: '/profile', icon: <FaUser />, label: 'Profile' },
  ];

  return (
    <div
      ref={ref}
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">🏗️ Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => toggleSidebar && toggleSidebar()}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2025 Architect Studio
          </p>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;