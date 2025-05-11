import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaFilter, FaSearch,FaEdit,FaTrash } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const AnimateursDashboard = () => {
  const [data, setData] = useState([]);
  const [editForm, setEditForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('nom');
  const [filterValue, setFilterValue] = useState('');
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://127.0.0.1:8000/api/formateurs-animateurs', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const formattedData = response.data.map(item => ({
          id: item.utilisateur.matrecule,
          matrecule: item.utilisateur.matrecule,
          nom: item.utilisateur.nom,
          email: item.utilisateur.email,
          role: item.utilisateur.role,
          utilisateur_id: item.utilisateur_id,
        }));
        setData(formattedData);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des animateurs :', error);
        Swal.fire('Erreur', 'Impossible de charger les animateurs', 'error');
      });
  };

  const handleEditClick = (item) => {
    setEditingId(item.utilisateur_id);
    setEditForm({
      nom: item.nom,
      email: item.email,
      matrecule: item.matrecule,
      role: item.role,
      motdePasse: "",
    });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleDelete = (utilisateur_id) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas annuler cette action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(utilisateur_id);

        axios.delete(`http://127.0.0.1:8000/api/users/${utilisateur_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(() => {
            setData(prev => prev.filter(item => item.utilisateur_id !== utilisateur_id));
            Swal.fire(
              'Supprimé!',
              "L'animateur a été supprimé.",
              'success'
            );
          })
          .catch(error => {
            Swal.fire('Erreur', "Erreur lors de la suppression.", 'error');
            console.error("Erreur suppression :", error.response || error);
          })
          .finally(() => setDeletingId(null));
      }
    });
  };

  const handleUpdate = (utilisateur_id) => {
    axios.put(`http://127.0.0.1:8000/api/Animateur/${utilisateur_id}`, editForm, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setData(prev =>
          prev.map(item =>
            item.utilisateur_id === utilisateur_id
              ? { ...item, ...editForm }
              : item
          )
        );
        setEditingId(null);
        Swal.fire('Succès', 'Modifications enregistrées avec succès', 'success');
      })
      .catch(error => {
        Swal.fire('Erreur', "Erreur lors de la mise à jour.", 'error');
        console.error("Mise à jour erreur :", error.response || error);
      });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterField('nom');
    setFilterValue('');
  };

  const filteredData = data.filter(item => {
    // Apply search term filter
    const matchesSearch = searchTerm === '' || 
      item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.matrecule.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply additional filter if specified
    const matchesFilter = filterValue === '' || 
      String(item[filterField]).toLowerCase().includes(filterValue.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Animateurs</h1>
            <p className="mt-1 text-sm text-gray-500">Liste complète des formateurs animateurs</p>
          </div>
          <Link to={'/ajouteranimateur'} className="mt-4 md:mt-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
              <FaUserPlus className="text-sm" /> Ajouter un Animateur
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
                placeholder="Rechercher par nom, email ou matricule..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border px-3 py-2 rounded-md bg-white gap-2 text-sm text-gray-600">
                <FaFilter className="text-gray-400" /> <span>Filtrer par</span>
              </div>
              <select 
                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
              >
                <option value="nom">Nom</option>
                <option value="email">Email</option>
                <option value="matrecule">Matricule</option>
                <option value="role">Rôle</option>
              </select>
              <input
                type="text"
                placeholder="Valeur du filtre..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <button 
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Réinitialiser
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
                    Matricule
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mot de passe
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map(item => (
                    <tr key={item.utilisateur_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.utilisateur_id ? (
                          <input
                            name="matrecule"
                            value={editForm.matrecule}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <span className="font-medium">{item.matrecule}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.utilisateur_id ? (
                          <input
                            name="nom"
                            value={editForm.nom}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          item.nom
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.utilisateur_id ? (
                          <input
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
                        {editingId === item.utilisateur_id ? (
                          <select
                            name="role"
                            value={editForm.role}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="formateur_animateur">Animateur</option>
                          </select>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                            {item.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.utilisateur_id ? (
                          <input
                            type="password"
                            name="motdePasse"
                            value={editForm.motdePasse}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Laisser vide pour ne pas changer"
                          />
                        ) : (
                          <span className="text-gray-400">••••••••</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === item.utilisateur_id ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleUpdate(item.utilisateur_id)}
                              className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                            >
                              Enregistrer
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                            >
                              Annuler
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
                              disabled={deletingId === item.utilisateur_id}
                              className={`text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors ${deletingId === item.utilisateur_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {deletingId === item.utilisateur_id ? 'Suppression...' : ''}
                                                    <FaTrash />

                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucun animateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredData.length}</span> sur{' '}
                  <span className="font-medium">{filteredData.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Précédent</span>
                    <IoIosArrowBack className="h-4 w-4" />
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Suivant</span>
                    <IoIosArrowForward className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimateursDashboard;