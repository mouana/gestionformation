import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFilter, FaUserPlus, FaSearch,FaEdit,FaTrash } from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const CdcDashboard = () => {
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
    axios.get('http://127.0.0.1:8000/api/cdc', {
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
        console.error('Erreur lors du chargement des CDC :', error);
        Swal.fire('Erreur', 'Impossible de charger les CDC', 'error');
      });
  };

  const handleEditClick = (item) => {
    setEditingId(item.utilisateur_id);
    setEditForm({
      nom: item.nom,
      email: item.email,
      matrecule: item.matrecule,
      role: item.role || "responsable_cdc",
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
              'Le CDC a été supprimé.',
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
    axios.put(`http://127.0.0.1:8000/api/cdc/${utilisateur_id}`, editForm, {
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
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">CDCs</h1>
          <Link to={'/ajoutercdc'}>
            <button className="bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-800 transition">
              <FaUserPlus /> Ajouter CDC
            </button>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center border px-3 py-2 rounded-md bg-white gap-2">
              <FaFilter className="text-gray-400" /> 
              <select 
                className="border-none bg-transparent focus:outline-none focus:ring-0"
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
              >
                <option value="nom">Nom</option>
                <option value="email">Email</option>
                <option value="matrecule">Matricule</option>
                <option value="role">Rôle</option>
              </select>
            </div>
            
            <input
              type="text"
              placeholder="Filtrer..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            
            <button 
              onClick={resetFilters}
              className="px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-md transition"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-auto bg-white rounded shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-3">Matricule</th>
                <th className="px-6 py-3">Nom</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Rôle</th>
                <th className="px-6 py-3">Mot de passe</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(item => (
                  <tr key={item.utilisateur_id} className="border-t hover:bg-gray-50 text-sm">
                    <td className="px-6 py-4">
                      {editingId === item.utilisateur_id ? (
                        <input
                          name="matrecule"
                          value={editForm.matrecule}
                          onChange={handleChange}
                          className="border p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        item.matrecule
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === item.utilisateur_id ? (
                        <input
                          name="nom"
                          value={editForm.nom}
                          onChange={handleChange}
                          className="border p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        item.nom
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === item.utilisateur_id ? (
                        <input
                          name="email"
                          value={editForm.email}
                          onChange={handleChange}
                          className="border p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        item.email
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === item.utilisateur_id ? (
                        <select
                          name="role"
                          value={editForm.role}
                          onChange={handleChange}
                          className="border p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="responsable_cdc">CDC</option>
                        </select>
                      ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {item.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === item.utilisateur_id ? (
                        <input
                          type="password"
                          name="motdePasse"
                          value={editForm.motdePasse}
                          onChange={handleChange}
                          className="border p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Laisser vide pour ne pas changer"
                        />
                      ) : (
                        "••••••"
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {editingId === item.utilisateur_id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(item.utilisateur_id)}
                            className="text-green-600 hover:underline"
                          >
                            Enregistrer
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-500 hover:underline"
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(item)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />

                          </button>
                          <button
                            onClick={() => handleDelete(item.utilisateur_id)}
                            disabled={deletingId === item.utilisateur_id}
                            className={`text-red-600 hover:underline ${deletingId === item.utilisateur_id ? 'opacity-50' : ''}`}
                          >
                            {deletingId === item.utilisateur_id ? '...' : ''}
                            <FaTrash />

                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Aucun CDC trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4 gap-2">
          <button className="p-2 bg-white rounded border hover:bg-gray-100">
            <IoIosArrowBack />
          </button>
          <button className="p-2 bg-white rounded border hover:bg-gray-100">
            <IoIosArrowForward />
          </button>
        </div>
      </main>
    </div>
  );
};

export default CdcDashboard;