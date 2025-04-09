import React, { useEffect, useState } from 'react';
import DashboardLayout from './layout/DashboardLayout';

const Animateurs = () => {
  const [animateurs, setAnimateurs] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    ista: ''
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/users')
      .then(response => response.json())
      .then(data => setAnimateurs(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Animateurs</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              + Add Animateur
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Filter By</span>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
              >
                <option value="">Name</option>
                {/* Add options */}
              </select>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.email}
                onChange={(e) => setFilters({...filters, email: e.target.value})}
              >
                <option value="">Email</option>
                {/* Add options */}
              </select>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.ista}
                onChange={(e) => setFilters({...filters, ista: e.target.value})}
              >
                <option value="">ISTA</option>
                {/* Add options */}
              </select>
            </div>
            <button className="text-red-600 hover:text-red-700 font-medium">
              Reset Filter
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">First Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Last Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Telephone</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ISTA Name</th>
                </tr>
              </thead>
              <tbody>
                {animateurs.map((animateur, index) => (
                  <tr 
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">{animateur.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{animateur.firstName}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{animateur.lastName}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{animateur.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{animateur.telephone}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{animateur.istaName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing 1 to 10 of {animateurs.length} entries
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Animateurs; 