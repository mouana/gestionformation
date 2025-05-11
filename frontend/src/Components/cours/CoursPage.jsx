import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FilteredCours from './FilteredCours';

const statusColor = {
  'planifiée': 'bg-green-100 text-green-700',
  'en cours': 'bg-purple-100 text-purple-700',
  'terminée': 'bg-orange-100 text-orange-700',
  'annulée': 'bg-pink-100 text-pink-700',

};

const token = localStorage.getItem("auth_token");

export default function CoursPage() {
  const [cours, setCours] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedCour, setEditedCour] = useState({});

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/cours', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
      .then(response => {
        if (response.data.cours) {
          setCours(response.data.cours);
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des cours:', error);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return;

    axios.delete(`http://127.0.0.1:8000/api/delete-cour/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setCours(cours.filter(c => c.id !== id));
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du cours:', error);
      });
  };

  const handleEdit = (cour) => {
    setEditId(cour.id);
    setEditedCour({ ...cour });
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const keys = field.split('.');
      setEditedCour(prev => {
        const updated = { ...prev };
        let obj = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          obj[keys[i]] = { ...obj[keys[i]] };
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setEditedCour(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = (id) => {
    const formData = new FormData();
    for (const key in editedCour) {
      if (typeof editedCour[key] === 'object') {
        formData.append(key, JSON.stringify(editedCour[key]));
      } else {
        formData.append(key, editedCour[key]);
      }
    }

    axios.put(`http://127.0.0.1:8000/api/update-cour/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        setCours(prev =>
          prev.map(c => c.id === id ? response.data.cour : c)
        );
        setEditId(null);
        setEditedCour({});
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du cours:', error.response?.data || error.message);
      });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditedCour({});
  };

  return (
    <div className="p-6 space-y-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Cours</h2>
        <Link to="/ajoutercour">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Ajouter Cours
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Titre</th>
              <th className="p-3 text-left">Formation</th>
              <th className="p-3 text-left">Formateur</th>
              <th className="p-3 text-left">Date Début</th>
              <th className="p-3 text-left">Date Fin</th>
              <th className="p-3 text-left">Heure</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Support</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cours.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.id}</td>
                <td className="p-3">
  {editId === item.id ? (
    <input
      type="text"
      value={editedCour.titre || ''}
      onChange={(e) => handleChange('titre', e.target.value)}
      className="border px-2 py-1 rounded w-full"
    />
  ) : (
    item.titre
  )}
</td>

                <td className="p-3">
                  {editId === item.id ? (
                    <input
                      type="text"
                      value={editedCour.formation?.titre || ''}
                      onChange={(e) => handleChange('formation.titre', e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    item.formation?.titre || 'N/A'
                  )}
                </td>
                
                <td className="p-3">
                  {editId === item.id ? (
                    <input
                      type="text"
                      value={editedCour.formateur_animateur?.utilisateur?.nom || ''}
                      onChange={(e) => handleChange('formateur_animateur.utilisateur.nom', e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    item.formateur_animateur?.utilisateur?.nom || 'N/A'
                  )}
                </td>
                <td className="p-3">
                  {editId === item.id ? (
                    <input
                      type="date"
                      value={editedCour.dateDebut || ''}
                      onChange={(e) => handleChange('dateDebut', e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    item.dateDebut
                  )}
                </td>
                <td className="p-3">
                  {editId === item.id ? (
                    <input
                      type="date"
                      value={editedCour.dateFin || ''}
                      onChange={(e) => handleChange('dateFin', e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    item.dateFin
                  )}
                </td>
       
                <td className="p-3">
                  {editId === item.id ? (
                    <>
                      <input
                        type="time"
                        value={editedCour.heure_debut || ''}
                        onChange={(e) => handleChange('heure_debut', e.target.value)}
                        className="border px-2 py-1 rounded w-full mb-1"
                      />
                      <input
                        type="time"
                        value={editedCour.heure_fin || ''}
                        onChange={(e) => handleChange('heure_fin', e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </>
                  ) : (
                    `${item.heure_debut} - ${item.heure_fin}`
                  )}
                </td>
                <td className="p-3">
                  {editId === item.id ? (
                    <select
                      value={editedCour.statut || ''}
                      onChange={(e) => handleChange('statut', e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    >
                      <option value="planifiée">planifiée</option>
                      <option value="en cours">en cours</option>
                      <option value="terminée">terminée</option>
                      <option value="annulée">annulée</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[item.statut] || 'bg-gray-100 text-gray-600'}`}>
                      {item.statut}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {item.support_url ? (
                    <a
                      href={`http://127.0.0.1:8000${item.support_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Télécharger
                    </a>
                  ) : (
                    'Aucun'
                  )}
                </td>
                <td className="p-3 flex space-x-2">
                  {editId === item.id ? (
                    <>
                      <button
                        onClick={() => handleSave(item.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cours validés et rejetés */}
      <FilteredCours />
    </div>
  );
}
