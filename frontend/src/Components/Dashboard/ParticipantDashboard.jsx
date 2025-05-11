import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFilter, FaUserPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ParticipantDashboard = () => {
  const [data, setData] = useState([]);
  const [editForm, setEditForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('first');
  const [filterValue, setFilterValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://127.0.0.1:8000/api/participant', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      const formattedData = response.data.map(item => ({
        id: item.utilisateur.matrecule,
        utilisateur_id: item.utilisateur_id,
        first: item.utilisateur.nom,
        email: item.utilisateur.email,
        region: item.region,
        ville: item.ville,
        ISTA: item.ISTA,
        role: item.role,
        filiere: 'DEV' 
      }));
      setData(formattedData);
    })
    .catch(error => {
      console.error('Error fetching participants:', error);
      Swal.fire('Error', 'Failed to load participants', 'error');
    });
  };

  const handleEditClick = (item) => {
    setEditingId(item.utilisateur_id);
    setEditForm({
      nom: item.first,
      email: item.email,
      matrecule: item.id,
      role: item.role || "formateur_participant",
    });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = (utilisateur_id) => {
    axios.put(`http://127.0.0.1:8000/api/participant/${utilisateur_id}`, editForm, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      setData(prev =>
        prev.map(item =>
          item.utilisateur_id === utilisateur_id
            ? { ...item, ...editForm, first: editForm.nom }
            : item
        )
      );
      setEditingId(null);
      Swal.fire('Success', 'Participant updated successfully', 'success');
    })
    .catch(error => {
      Swal.fire('Error', "Failed to update participant", 'error');
      console.error("Update error:", error);
    });
  };

  const handleDelete = (utilisateur_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/api/users/${utilisateur_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          setData(prev => prev.filter(item => item.utilisateur_id !== utilisateur_id));
          Swal.fire('Deleted!', 'Participant has been deleted.', 'success');
        })
        .catch(error => {
          Swal.fire('Error', 'Failed to delete participant', 'error');
          console.error("Delete error:", error);
        });
      }
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterField('first');
    setFilterValue('');
    setStatusFilter('');
  };

  const filteredData = data.filter(item => {
    // Apply search term filter
    const matchesSearch = searchTerm === '' || 
      item.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ISTA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply field filter
    const matchesField = filterValue === '' || 
      String(item[filterField]).toLowerCase().includes(filterValue.toLowerCase());

    // Apply role filter
    const matchesRole = statusFilter === '' || 
      item.role === statusFilter;

    return matchesSearch && matchesField && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Participants</h1>
            <p className="mt-1 text-sm text-gray-500">List of all training participants</p>
          </div>
          <Link to={'/ajouterparticipant'} className="mt-4 md:mt-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
              <FaUserPlus className="text-sm" /> Add Participant
            </button>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, region, city or ISTA..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border px-3 py-2 rounded-md bg-white gap-2 text-sm text-gray-600">
                <FaFilter className="text-gray-400" /> <span>Filter by</span>
              </div>
              <select 
                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
              >
                <option value="first">Name</option>
                <option value="email">Email</option>
                <option value="region">Region</option>
                <option value="ville">City</option>
                <option value="ISTA">ISTA</option>
              </select>
              <input
                type="text"
                placeholder="Filter value..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <select
                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="formateur_participant">Formateur Participant</option>
                <option value="participant">Participant</option>
              </select>
              <button 
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISTA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.utilisateur_id ? (
                          <input
                            type="text"
                            name="nom"
                            value={editForm.nom}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          item.first
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.utilisateur_id ? (
                          <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          item.email
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.ville}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.ISTA}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {item.filiere}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.utilisateur_id ? (
                          <select
                            name="role"
                            value={editForm.role}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="formateur_participant">Formateur Participant</option>
                            <option value="participant">Participant</option>
                          </select>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {item.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === item.utilisateur_id ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleUpdate(item.utilisateur_id)}
                              className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(item.utilisateur_id)}
                              className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                      No participants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredData.length}</span> of{' '}
                <span className="font-medium">{filteredData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <IoIosArrowBack className="h-4 w-4" />
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <IoIosArrowForward className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;