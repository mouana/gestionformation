import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFilter, FaUserPlus } from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const AnimateursDashboard = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [utilisateur, setUtilisateur] = useState(null);
  const [editForm, setEditForm] = useState({
    nom: '',
    email: '',
    role: ''
  });

  const [isUpdating, setIsUpdating] = useState(false);
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
          nom: item.utilisateur.nom,
          email: item.utilisateur.email,
          role: item.utilisateur.role,
          utilisateur_id: item.utilisateur_id,
        }));

        setData(formattedData);
        setUtilisateur(utilisateur)
        
        console.log(utilisateur)
      })
      .catch(error => {
        console.error('Erreur lors du chargement des animateurs :', error);
      });
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditForm({
      nom: item.nom,
      email: item.email,
      role: item.role
    });
  };

 const handleUpdate = (utilisateur_id) => {
  if (!utilisateur_id) return alert("ID de l'utilisateur manquant");

  setIsUpdating(true);

  axios.put(`http://127.0.0.1:8000/api/users/${utilisateur_id}`, editForm, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then((response) => {
      const updatedUser = response.data.utilisateur;

      setData(prev =>
        prev.map(item =>
          item.utilisateur_id === utilisateur_id ? { ...item, ...updatedUser } : item
        )
      );

      setEditId(null);
    })
    .catch(error => {
      const msg = error.response?.data?.errors
        ? JSON.stringify(error.response.data.errors, null, 2)
        : "Erreur lors de la mise à jour.";

      alert(msg);
      console.error("Erreur update :", error);
      console.log("Détails de l'erreur :", error.response?.data);
    })
    .finally(() => setIsUpdating(false));
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

  
  
  

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Animateurs</h1>
          <Link to={'/ajouteranimateur'}>
            <button className="bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
              <FaUserPlus /> Ajouter Animateurs
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center border px-4 py-2 rounded bg-white gap-2">
            <FaFilter /> <span>Filter By</span>
          </div>
          <select className="px-4 py-2 rounded border bg-white">
            <option>Nom</option>
          </select>
          <select className="px-4 py-2 rounded border bg-white">
            <option>Email</option>
          </select>
          <select className="px-4 py-2 rounded border bg-white">
            <option>Rôle</option>
          </select>
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
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 text-sm">
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">
                    {editId === item.id ? (
                      <input
                        type="text"
                        value={editForm.nom}
                        onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      item.nom
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editId === item.id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      item.email
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editId === item.id ? (
                      <input
                        type="text"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      item.role
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {editId === item.id ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          disabled={isUpdating}
                          className={`text-green-600 hover:underline ${isUpdating ? 'opacity-50' : ''}`}
                        >
                          {isUpdating ? '...' : 'Enregistrer'}
                        </button>
                        <button onClick={() => setEditId(null)} className="text-gray-600 hover:underline">Annuler</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Modifier</button>
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
