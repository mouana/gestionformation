import React, { useState } from 'react';
import axios from 'axios';

const AddCdcForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motdePasse: '',
    matrecule: '',
    filiere: '',
    region: '',
    role: 'responsable_cdc',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/admin/utilisateur', formData
        , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
    });
      setMessage('Utilisateur créé avec succès !');
      setFormData({
        nom: '',
        email: '',
        motdePasse: '',
        matrecule: '',
        filiere: '',
        region: '',
        role: 'responsable_cdc',
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setMessage("Erreur lors de la requête");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Créer Responsable CDC</h2>
      
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
        </div>

        <div>
          <label className="block">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block">Mot de passe</label>
          <input
            type="password"
            name="motdePasse"
            value={formData.motdePasse}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.motdePasse && <p className="text-red-500 text-sm">{errors.motdePasse}</p>}
        </div>

        <div>
          <label className="block">Matricule</label>
          <input
            type="text"
            name="matrecule"
            value={formData.matrecule}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.matrecule && <p className="text-red-500 text-sm">{errors.matrecule}</p>}
        </div>

        <div>
          <label className="block">Filière</label>
          <input
            type="text"
            name="filiere"
            value={formData.filiere}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.filiere && <p className="text-red-500 text-sm">{errors.filiere}</p>}
        </div>

        <div>
          <label className="block">Région</label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.region && <p className="text-red-500 text-sm">{errors.region}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Créer Responsable CDC
        </button>
      </form>
    </div>
  );
};

export default AddCdcForm;
