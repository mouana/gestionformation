import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateCdcForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    filiere: '',
    region: '',
    role: 'responsable_cdc',
    utilisateur: {
      nom: '',
      prenom: '',
      email: '',
      telephone: ''
    }
  });

  useEffect(() => {
    const fetchCdcData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/responsable-cdc/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setFormData(response.data);
      } catch (err) {
        console.error('Error fetching CDC data:', err);
        setError('Erreur lors du chargement des données du responsable CDC');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCdcData();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Update the CDC responsable
      await axios.put(`http://127.0.0.1:8000/api/responsable-cdc/${id}`, {
        filiere: formData.filiere,
        region: formData.region,
        role: formData.role
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the user details if needed
      if (formData.utilisateur && formData.utilisateur.id) {
        await axios.put(`http://127.0.0.1:8000/api/utilisateurs/${formData.utilisateur.id}`, {
          nom: formData.utilisateur.nom,
          prenom: formData.utilisateur.prenom,
          email: formData.utilisateur.email,
          telephone: formData.utilisateur.telephone
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      // Redirect to CDC dashboard on success
      navigate('/cdc');
    } catch (err) {
      console.error('Error updating CDC responsable:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du responsable CDC');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100 justify-center items-center">
        <div className="text-center">
          <p className="text-lg">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold mb-6">Modifier le Responsable CDC</h1>

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
                  name="utilisateur.nom"
                  value={formData.utilisateur?.nom || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  name="utilisateur.prenom"
                  value={formData.utilisateur?.prenom || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="utilisateur.email"
                  value={formData.utilisateur?.email || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Téléphone</label>
                <input
                  type="text"
                  name="utilisateur.telephone"
                  value={formData.utilisateur?.telephone || ''}
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
                  value={formData.filiere || ''}
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
                  value={formData.region || ''}
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
                {loading ? 'Chargement...' : 'Mettre à jour'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdateCdcForm;
