import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch, FaFilter, FaCalendarAlt, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const statusColor = {
  "terminée": "bg-green-100 text-green-700",
  "en cour": "bg-purple-100 text-purple-700",
  "rejetée": "bg-red-100 text-red-700",
  "en attente": "bg-orange-100 text-orange-700",
  "en transit": "bg-pink-100 text-pink-700",
  "validée": "bg-blue-100 text-blue-700",
};

const statusOptions = [
  { value: "terminée", label: "Terminée" },
  { value: "en cours", label: "En cours" },
  { value: "rejetée", label: "Rejetée" },
  { value: "en attente", label: "En attente" },
  { value: "validée", label: "Validée" },
];

export default function DrifFormation() {
  const [formations, setFormations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedFormation, setEditedFormation] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); 

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = () => {
    setIsLoading(true);
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
        console.error("Erreur lors du chargement des formations:", error);
        Swal.fire("Erreur", "Échec du chargement des formations", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas annuler cette action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        axios
          .delete(`http://127.0.0.1:8000/api/formation/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setFormations(formations.filter((f) => f.id !== id));
            Swal.fire("Supprimé!", "La formation a été supprimée.", "success");
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression:", error);
            Swal.fire("Erreur", "Échec de la suppression", "error");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });
  };

  const handleEditStatus = (formation) => {
    setEditId(formation.id);
    setEditedFormation({ ...formation });
  };

  const handleStatusChange = (value) => {
    setEditedFormation((prev) => ({ ...prev, statut: value }));
  };

  const handleSaveStatus = (id) => {
    setIsLoading(true);
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
        Swal.fire("Succès", "Statut mis à jour avec succès", "success");
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la mise à jour:",
          error.response?.data || error.message
        );
        Swal.fire("Erreur", "Échec de la mise à jour du statut", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditedFormation({});
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const filteredFormations = formations.filter((formation) => {
    const matchesSearch = searchTerm === "" || 
      formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.animateur?.utilisateur?.nom.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "" || 
      formation.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFormations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFormations.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestion des Formations</h1>
            <p className="mt-1 text-sm text-gray-600">Liste des formations programmées</p>
          </div>
          <Link to="/ajouterformation" className="mt-4 md:mt-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 text-sm sm:text-base">
              + Ajouter une formation
            </button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par titre ou formateur..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border px-3 py-2 rounded-lg bg-white gap-2 text-sm text-gray-600">
                <FaFilter className="text-gray-400" /> <span>Statut</span>
              </div>
              <select
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button 
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Formations Cards */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map((formation) => (
                  <div key={formation.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                          {formation.titre}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColor[formation.statut] || "bg-gray-100 text-gray-600"
                        }`}>
                          {statusOptions.find(opt => opt.value === formation.statut)?.label || formation.statut}
                        </span>
                      </div>

                      <div className="space-y-3 mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUser className="flex-shrink-0 mr-2 text-gray-500" />
                          <span>Formateur: {formation.animateur?.utilisateur?.nom || "Non spécifié"}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-500" />
                          <span>Date: {new Date(formation.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <FaMapMarkerAlt className="flex-shrink-0 mr-2 text-gray-500" />
                          <span>Lieu: Rabat</span>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-between items-center">
                        {editId === formation.id ? (
                          <div className="flex-1 mr-3">
                            <select
                              value={editedFormation.statut}
                              onChange={(e) => handleStatusChange(e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="flex-1"></div>
                        )}
                        
                        <div className="flex space-x-2">
                          {editId === formation.id ? (
                            <>
                              <button
                                onClick={() => handleSaveStatus(formation.id)}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                Valider
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                              >
                                Annuler
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditStatus(formation)}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                Modifier statut
                              </button>
                              <button
                                onClick={() => handleDelete(formation.id)}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune formation trouvée</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || statusFilter !== '' 
                      ? "Essayez de modifier vos critères de recherche" 
                      : "Vous n'avez aucune formation programmée pour le moment"}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredFormations.length > itemsPerPage && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    &laquo;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-md border ${currentPage === number ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    &raquo;
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}