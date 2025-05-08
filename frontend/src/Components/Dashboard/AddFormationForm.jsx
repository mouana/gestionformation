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
  const navigate = useNavigate()
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const handleDateDebutChange = (e) => {
    const value = e.target.value;
    setDateDebut(value);

    if (value <= today) {
      setErrors((prev) => ({
        ...prev,
        dateDebut: 'La date de début doit être après la date d’aujourd’hui.',
      }));
    } else {
      setErrors((prev) => {
        const { dateDebut, ...rest } = prev;
        return rest;
      });
    }

    // Also validate dateFin again in case it's before new dateDebut
    if (dateFin && dateFin <= value) {
      setErrors((prev) => ({
        ...prev,
        dateFin: 'La date de fin doit être après la date de début.',
      }));
    } else {
      setErrors((prev) => {
        const { dateFin, ...rest } = prev;
        return rest;
      });
    }
  };
  const handleDateFinChange = (e) => {
    const value = e.target.value;
    setDateFin(value);

    if (value <= dateDebut) {
      setErrors((prev) => ({
        ...prev,
        dateFin: 'La date de fin doit être après la date de début.',
      }));
    } else {
      setErrors((prev) => {
        const { dateFin, ...rest } = prev;
        return rest;
      });
    }
  };
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAnimateurs, resParticipants] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/formateurs-animateurs', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://127.0.0.1:8000/api/participant', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            const options = res.data.map((p) => ({
              value: p.id,
              label: p.utilisateur.nom, // adjust based on API response structure
            }));
            setParticipants(options);
          })
        ]);
        setAnimateurs(resAnimateurs.data);
      } catch (err) {
        console.error("Error fetching animateurs or participants", err);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/add-formation',
        {
          titre,
          description,
          statut,
          animateur_id: animateurId,
          date_validation: dateFin, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert('Formation ajoutée avec succès !');
      navigate('/formations')
    } catch (error) {
      console.error('Erreur lors de l’ajout de la formation', error);
      alert("Échec de l'ajout de la formation");
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-6xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-6">Ajouter formation</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
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

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Description"
            rows="3"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Durée (jours)</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            value={(new Date(dateFin) - new Date(dateDebut)) / (1000 * 60 * 60 * 24) || 0}
            disabled
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Date début</label>
        <input
          type="date"
          value={dateDebut}
          onChange={handleDateDebutChange}
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
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        {errors.dateFin && <p className="text-red-500 text-sm mt-1">{errors.dateFin}</p>}
      </div>
    </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Statuts</label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="en attente">en attente</option>
              <option value="en cour">en cour</option>
              <option value="terminée">terminée</option>
              <option value="rejetée">rejetée</option>
              <option value="validée">validée</option>
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
              {animateurs.map((anim) => (
                <option key={anim.id} value={anim.id}>
                  {anim.utilisateur.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        
        <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Formateurs participants
      </label>
      <Select
        isMulti
        options={participants}
        value={participants.filter((p) =>
          selectedParticipants.includes(p.value)
        )}
        onChange={(selectedOptions) =>
          setSelectedParticipants(selectedOptions.map((opt) => opt.value))
        }
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner..."
      />
    </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" className="px-6 py-2 border rounded-lg hover:bg-gray-100">
              <Link to ={'/formations'}>Annuler</Link>
          </button>
          <button type="submit" className="px-6 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-lg">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddFormationForm;
