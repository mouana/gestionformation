import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


export default function AddFormateurAnimateur() {
        const navigateto = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    motdePasse: "",
    matrecule: "",
    role: "formateur_animateur", 
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/admin/utilisateur', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Utilisateur ajouté avec succès !");
      setFormData({
        nom: "",
        email: "",
        motdePasse: "",
        matrecule: "",
        role: "formateur_animateur",
      });
      navigateto('/animateurs')

    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data);
      } else if (error.response && error.response.status === 403) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Une erreur est survenue.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Ajouter un Formateur Animateur</h2>
      {message && <p className="text-center mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
          {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block font-medium">Mot de passe</label>
          <input
            type="password"
            name="motdePasse"
            value={formData.motdePasse}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
          {errors.motdePasse && <p className="text-red-500 text-sm">{errors.motdePasse}</p>}
        </div>

        <div>
          <label className="block font-medium">Matricule</label>
          <input
            type="text"
            name="matrecule"
            value={formData.matrecule}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
          {errors.matrecule && <p className="text-red-500 text-sm">{errors.matrecule}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
