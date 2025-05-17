import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';

function AddFormationForm() {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [statut, setStatut] = useState('en attente');
  const [animateurs, setAnimateurs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [animateurId, setAnimateurId] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animateursRes, participantsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/formateurs-animateurs', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://127.0.0.1:8000/api/participant', { // Make sure this endpoint matches your API
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setAnimateurs(animateursRes.data);
        
        // Format participants for react-select
        const participantOptions = participantsRes.data.map(p => ({
          value: p.id,
          label: p.utilisateur?.nom || `Participant ${p.id}` // Fallback if name not available
        }));
        setParticipants(participantOptions);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, [token]);

  const handleDateDebutChange = (e) => {
    const value = e.target.value;
    setDateDebut(value);

    if (value <= today) {
      setErrors(prev => ({ ...prev, dateDebut: 'La date de début doit être après aujourd\'hui' }));
    } else {
      const { dateDebut: _, ...rest } = errors;
      setErrors(rest);
    }

    if (dateFin && value >= dateFin) {
      setErrors(prev => ({ ...prev, dateFin: 'La date de fin doit être après la date de début' }));
    }
  };

  const handleDateFinChange = (e) => {
    const value = e.target.value;
    setDateFin(value);

    if (dateDebut && value <= dateDebut) {
      setErrors(prev => ({ ...prev, dateFin: 'La date de fin doit être après la date de début' }));
    } else {
      const { dateFin: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      alert('Veuillez corriger les erreurs avant de soumettre');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/add-formation',
        {
          titre,
          description,
          statut,
          animateur_id: animateurId,
          participants: selectedParticipants, // This will be handled by your backend
          date_debut: dateDebut,
          date_fin: dateFin
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 201) {
        alert('Formation et participants ajoutés avec succès!');
        navigate('/formations');
      }
    } catch (error) {
      console.error('Error adding formation:', error.response?.data || error.message);
      alert(`Erreur: ${error.response?.data?.message || 'Échec de l\'ajout de la formation'}`);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-6xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-6">Ajouter formation</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Titre Field */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Titre de la formation"
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Description"
            rows="3"
            required
          />
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Date début</label>
            <input
              type="date"
              value={dateDebut}
              onChange={handleDateDebutChange}
              min={today}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            {errors.dateDebut && <p className="text-red-500 text-sm mt-1">{errors.dateDebut}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Date fin</label>
            <input
              type="date"
              value={dateFin}
              onChange={handleDateFinChange}
              min={dateDebut || today}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            {errors.dateFin && <p className="text-red-500 text-sm mt-1">{errors.dateFin}</p>}
          </div>
        </div>

        {/* Status and Animateur Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Statut</label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="en attente">En attente</option>
              <option value="en cour">En cours</option>
              <option value="terminée">Terminée</option>
              <option value="rejetée">Rejetée</option>
              <option value="validée">Validée</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Formateur Responsable</label>
            <select
              value={animateurId}
              onChange={(e) => setAnimateurId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">-- Sélectionner --</option>
              {animateurs.map(anim => (
                <option key={anim.id} value={anim.id}>
                  {anim.utilisateur?.nom || `Formateur ${anim.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Participants Multi-Select */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Participants</label>
          <Select
            isMulti
            options={participants}
            value={participants.filter(p => selectedParticipants.includes(p.value))}
            onChange={(selected) => setSelectedParticipants(selected.map(opt => opt.value))}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Sélectionner les participants..."
            noOptionsMessage={() => "Aucun participant disponible"}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link to="/formations" className="px-6 py-2 border rounded-lg hover:bg-gray-100">
            Annuler
          </Link>
          <button 
            type="submit" 
            className="px-6 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
            disabled={Object.keys(errors).length > 0}
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddFormationForm;