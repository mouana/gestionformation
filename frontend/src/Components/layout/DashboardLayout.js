import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/formations', label: 'Formations', icon: '📚' },
    { path: '/formateurs', label: 'Formateurs', icon: '👥' },
    { path: '/animateurs', label: 'Animateurs', icon: '👤' },
    { path: '/inbox', label: 'Inbox', icon: '📥' },
    { path: '/cdc', label: 'CDC', icon: '📋' },
    { path: '/calendar', label: 'Calendar', icon: '📅' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <div className="flex items-center space-x-4">
              <input
                type="search"
                placeholder="Search"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">🔔</button>
              <div className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/32"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 