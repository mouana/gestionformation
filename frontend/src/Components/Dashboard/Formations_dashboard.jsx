import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FilteredFormations from './FilteredFormations'
const statusColor = {
  'terminée': 'bg-green-100 text-green-700',
  'en cour': 'bg-purple-100 text-purple-700',
  'rejetée': 'bg-red-100 text-red-700',
  'en attente': 'bg-orange-100 text-orange-700',
  'en transit': 'bg-pink-100 text-pink-700',
};

const token = localStorage.getItem("token");

export default function FormationsPage() {
  const [formations, setFormations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedFormation, setEditedFormation] = useState({});

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/formation', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.data.formations) {
          setFormations(response.data.formations);
        }
      })
      .catch(error => {
        console.error('Error fetching formations:', error);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this formation?")) return;

    axios.delete(`http://127.0.0.1:8000/api/formation/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setFormations(formations.filter(f => f.id !== id));
      })
      .catch(error => {
        console.error('Error deleting formation:', error);
      });
  };

  const handleEdit = (formation) => {
    setEditId(formation.id);
    setEditedFormation({ ...formation });
  };
  

  const handleChange = (field, value) => {
    setEditedFormation(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (id) => {
    console.log("Saving formation with ID:", id, "Data:", editedFormation); // Debug
  
    axios.put(`http://127.0.0.1:8000/api/formation/${id}`, editedFormation, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setFormations(prev =>
          prev.map(f => f.id === id ? response.data.formation : f)
        );
        setEditId(null);
        setEditedFormation({});
      })
      .catch(error => {
        console.error('Error updating formation:', error.response?.data || error.message);
      });
  };
  

  const handleCancel = () => {
    setEditId(null);
    setEditedFormation({});
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Formations</h2>
        <Link to="/ajouterformation">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Formation
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">TITLE</th>
              <th className="p-3 text-left">DUREE</th>
              <th className="p-3 text-left">Place</th>
              <th className="p-3 text-left">ANIMATEUR</th>
              <th className="p-3 text-left">STATUS</th>
              <th className="p-3 text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {formations.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.id}</td>
                <td className="p-3">
                  {editId === item.id ? (
                    <input
                      type="text"
                      value={editedFormation.titre}
                      onChange={(e) => handleChange('titre', e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    item.titre
                  )}
                </td>
                <td className="p-3">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="p-3">Rabat</td>
                <td className="p-3">{item.animateur?.utilisateur?.nom || 'N/A'}</td>
                <td className="p-3">
                  {editId === item.id ? (
                    <select
                      value={editedFormation.statut}
                      onChange={(e) => handleChange('statut', e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    >
                      <option value="terminée">terminée</option>
                      <option value="en cour">en cour</option>
                      <option value="rejetée">rejetée</option>
                      <option value="en attente">en attente</option>
                      <option value="validée">validée</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[item.statut] || 'bg-gray-100 text-gray-600'}`}>
                      {item.statut}
                    </span>
                  )}
                </td>
                <td className="p-3 flex space-x-2">
                  {editId === item.id ? (
                    <>
                      <button
                        onClick={() => handleSave(item.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <FilteredFormations />
      </div>
    </div>
  );
}
