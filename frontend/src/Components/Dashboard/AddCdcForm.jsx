import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCdcForm = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    filiere: '',
    region: '',
    role: 'responsable_cdc',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First create the user
      const userResponse = await axios.post('http://127.0.0.1:8000/api/admin/add-utilisateur', {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        telephone: formData.telephone,
        role: formData.role
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Then create the CDC responsable with the user ID
      await axios.post('http://127.0.0.1:8000/api/responsable-cdc', {
        filiere: formData.filiere,
        region: formData.region,
        role: formData.role,
        utilisateur_id: userResponse.data.id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Redirect to CDC dashboard on success
      navigate('/cdc');
    } catch (err) {
      console.error('Error adding CDC responsable:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'ajout du responsable CDC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold mb-6">Ajouter un Responsable CDC</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Téléphone</label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Filière</label>
                <input
                  type="text"
                  name="filiere"
                  value={formData.filiere}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Région</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/cdc')}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Chargement...' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddCdcForm;
