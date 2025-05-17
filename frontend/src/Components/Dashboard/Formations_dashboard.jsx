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
    setEditedFormation({ ...formation });
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
          prev.map((f) => (f.id === id ? response.data.formation : f))
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
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Place
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Animator
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFormations.length > 0 ? (
                  filteredFormations.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editId === item.id ? (
                          <input
                            type="text"
                            value={editedFormation.titre}
                            onChange={(e) => handleChange("titre", e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          item.titre
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rabat
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.animateur?.utilisateur?.nom || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editId === item.id ? (
                          <select
                            value={editedFormation.statut}
                            onChange={(e) => handleChange("statut", e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="terminée">Completed</option>
                            <option value="en cour">In Progress</option>
                            <option value="rejetée">Rejected</option>
                            <option value="en attente">Pending</option>
                            <option value="validée">Validated</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              statusColor[item.statut] || "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.statut}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editId === item.id ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleSave(item.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
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
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No formations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}