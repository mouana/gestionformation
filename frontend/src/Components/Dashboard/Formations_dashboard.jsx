import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const statusColor = {
  terminée: "bg-green-100 text-green-700",
  "en cour": "bg-purple-100 text-purple-700",
  rejetée: "bg-red-100 text-red-700",
  "en attente": "bg-orange-100 text-orange-700",
  "en transit": "bg-pink-100 text-pink-700",
  validée: "bg-blue-100 text-blue-700",
};

export default function FormationsPage() {
  const [formations, setFormations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedFormation, setEditedFormation] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("titre");
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = () => {
    axios.get("http://127.0.0.1:8000/api/formation", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.formations) {
          setFormations(response.data.formations);
        }
      })
      .catch((error) => {
        console.error("Error fetching formations:", error);
        Swal.fire("Error", "Failed to load formations", "error");
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8000/api/formation/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setFormations(formations.filter((f) => f.id !== id));
            Swal.fire("Deleted!", "The formation has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting formation:", error);
            Swal.fire("Error", "Failed to delete formation", "error");
          });
      }
    });
  };

  const handleEdit = (formation) => {
    setEditId(formation.id);
    setEditedFormation({ 
      titre: formation.titre,
      // Exclude statut from editable fields
    });
  };

  const handleChange = (field, value) => {
    setEditedFormation((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (id) => {
    axios
      .put(`http://127.0.0.1:8000/api/formation/${id}`, editedFormation, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFormations((prev) =>
          prev.map((f) => (f.id === id ? { ...f, titre: response.data.formation.titre } : f))
        );
        setEditId(null);
        setEditedFormation({});
        Swal.fire("Success", "Formation updated successfully", "success");
      })
      .catch((error) => {
        console.error(
          "Error updating formation:",
          error.response?.data || error.message
        );
        Swal.fire("Error", "Failed to update formation", "error");
      });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditedFormation({});
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterField("titre");
    setFilterValue("");
    setStatusFilter("");
  };

  const filteredFormations = formations.filter((formation) => {
    // Apply search term filter
    const matchesSearch = searchTerm === "" || 
      formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.animateur?.utilisateur?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.statut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.created_at.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply field filter
    const matchesField = filterValue === "" || 
      String(formation[filterField]).toLowerCase().includes(filterValue.toLowerCase());

    // Apply status filter
    const matchesStatus = statusFilter === "" || 
      formation.statut === statusFilter;

    return matchesSearch && matchesField && matchesStatus;
  });

  // Get validated formations
  const validatedFormations = formations.filter(f => f.statut === "validée");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Formations</h2>
            <p className="mt-1 text-sm text-gray-500">Manage all training sessions</p>
          </div>
          <Link to="/ajouterformation" className="mt-4 md:mt-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
              + Add Formation
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
                placeholder="Search by title, animator, status or date..."
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
                <option value="titre">Title</option>
                <option value="animateur.utilisateur.nom">Animator</option>
                <option value="created_at">Date</option>
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
                <option value="">All Status</option>
                <option value="terminée">Completed</option>
                <option value="en cour">In Progress</option>
                <option value="rejetée">Rejected</option>
                <option value="en attente">Pending</option>
                <option value="validée">Validated</option>
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
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            ID
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Title
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Date
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Place
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Animator
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Status
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredFormations.length > 0 ? (
          filteredFormations.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{item.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {editId === item.id ? (
                  <input
                    type="text"
                    value={editedFormation.titre}
                    onChange={(e) => handleChange("titre", e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <span className="font-medium">{item.titre}</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(item.created_at).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                Rabat
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {item.animateur?.utilisateur?.nom || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${
                    statusColor[item.statut] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.statut}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editId === item.id ? (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSave(item.id)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium flex items-center"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="px-6 py-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-600">No formations found</p>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filter</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  {filteredFormations.length > 0 && (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">{filteredFormations.length}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              disabled
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            {/* Current: "z-10 bg-blue-50 border-blue-500 text-blue-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
            <button
              aria-current="page"
              className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              1
            </button>
            <button
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              2
            </button>
            <button
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              3
            </button>
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )}
</div>

        {/* Validated Formations Card */}
        {validatedFormations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Les formations validées par le responsable DRIF
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {validatedFormations.map(formation => (
                <div key={formation.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <h4 className="font-medium text-lg text-gray-800">{formation.titre}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Animator:</span> {formation.animateur?.utilisateur?.nom || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(formation.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[formation.statut] || "bg-gray-100 text-gray-600"}`}
                    >
                      {formation.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}