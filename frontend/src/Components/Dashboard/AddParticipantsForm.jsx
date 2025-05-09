import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function AddParticipantForm() {
    const navigateto = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motdePasse: '',
    matrecule: '',
    ISTA: '',
    region: '',
    ville: '',
  });
  navigateto('formateurs')
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token"); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      role: 'formateur_participant',
    };

    try {
      setLoading(true);
      await axios.post('http://127.0.0.1:8000/api/admin/utilisateur', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
      });

      alert("Participant ajouté avec succès !");
      setFormData({
        nom: '',
        email: '',
        motdePasse: '',
        matrecule: '',
        ISTA: '',
        region: '',
        ville: '',
      });
    } catch (error) {
      console.error('Erreur lors de l’ajout :', error.response?.data || error.message);
      alert("Erreur lors de l'ajout : " + (error.response?.data?.message || "Veuillez vérifier les données."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Ajouter un Participant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
        <input type="password" name="motdePasse" placeholder="Mot de passe" value={formData.motdePasse} onChange={handleChange} className="w-full px-4 py-2 border rounded" minLength="6" required />
        <input type="text" name="matrecule" placeholder="Matricule" value={formData.matrecule} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
        <input type="text" name="ISTA" placeholder="ISTA" value={formData.ISTA} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input type="text" name="region" placeholder="Région" value={formData.region} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input type="text" name="ville" placeholder="Ville" value={formData.ville} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold rounded">
          {loading ? 'Ajout en cours...' : 'Ajouter Participant'}
        </button>
      </form>
    </div>
  );
}
