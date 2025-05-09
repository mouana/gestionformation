import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFilter, FaUserPlus } from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const AnimateursDashboard = () => {
  const [data, setData] = useState([]);
  const [editForm, setEditForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
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
    if (!window.confirm("Voulez-vous vraiment supprimer cet animateur ?")) return;

    setDeletingId(utilisateur_id);

    axios.delete(`http://127.0.0.1:8000/api/users/${utilisateur_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setData(prev => prev.filter(item => item.utilisateur_id !== utilisateur_id));
      })
      .catch(error => {
        alert("Erreur lors de la suppression.");
        console.error("Erreur suppression :", error.response || error);
      })
      .finally(() => setDeletingId(null));
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
      })
      .catch(error => {
        alert("Erreur lors de la mise à jour.");
        console.error("Mise à jour erreur :", error.response || error);
      });
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Animateurs</h1>
          <Link to={'/ajouteranimateur'}>
            <button className="bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
              <FaUserPlus /> Ajouter Animateur
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center border px-4 py-2 rounded bg-white gap-2">
            <FaFilter /> <span>Filter By</span>
          </div>
          <select className="px-4 py-2 rounded border bg-white"><option>Nom</option></select>
          <select className="px-4 py-2 rounded border bg-white"><option>Email</option></select>
          <select className="px-4 py-2 rounded border bg-white"><option>Rôle</option></select>
          <button className="text-red-500 font-medium">Reset Filter</button>
        </div>

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
              {data.map(item => (
                <tr key={item.utilisateur_id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="px-6 py-4">
                    {editingId === item.utilisateur_id ? (
                      <input
                        name="matrecule"
                        value={editForm.matrecule}
                        onChange={handleChange}
                        className="border p-1"
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
                        className="border p-1"
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
                        className="border p-1"
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
                        className="border p-1"
                      >
                        <option value="formateur_animateur">Animateur</option>
                      </select>
                    ) : (
                      item.role
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item.utilisateur_id ? (
                      <input
                        type="password"
                        name="motdePasse"
                        value={editForm.motdePasse}
                        onChange={handleChange}
                        className="border p-1"
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
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(item.utilisateur_id)}
                          disabled={deletingId === item.utilisateur_id}
                          className={`text-red-600 hover:underline ${deletingId === item.utilisateur_id ? 'opacity-50' : ''}`}
                        >
                          {deletingId === item.utilisateur_id ? '...' : 'Supprimer'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button className="p-2 bg-white rounded border"><IoIosArrowBack /></button>
          <button className="p-2 bg-white rounded border"><IoIosArrowForward /></button>
        </div>
      </main>
    </div>
  );
};

export default AnimateursDashboard;
