import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddCoursForm() {
  const [titre, setTitre] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [support, setSupport] = useState();
  const [formationId, setFormationId] = useState("");
  const [formations, setFormations] = useState([]);
  const [formateurId, setFormateurId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/formation", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const validFormations = res.data.formations.filter(
          (f) => f.statut === "validée"
        );

        setFormations(validFormations);
      } catch (error) {
        console.error("Erreur lors du chargement des formations:", error);
      }
    };

    fetchFormations();
  }, [token]);

  useEffect(() => {
    const selectedFormation = formations.find(f => f.id === parseInt(formationId));
    if (selectedFormation) {
      setFormateurId(selectedFormation.animateur_id);
    }
  }, [formationId, formations]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("formation_id", formationId);
    formData.append("formateur_animateur_id", formateurId);
    formData.append("titre", titre);
    formData.append("dateDebut", dateDebut);
    formData.append("dateFin", dateFin);
    formData.append("heure_debut", heureDebut);
    formData.append("heure_fin", heureFin);
    formData.append("statut", "en cours");

    if (support) {
      formData.append("support", support);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/add-cour", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Cours ajouté avec succès !");
      navigate("/cour");
    } catch (error) {
      console.error("Erreur lors de l’ajout du cours :", error);
      alert("Échec de l’ajout du cours");
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-6">Ajouter Cours</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Formation</label>
          <select
            value={formationId}
            onChange={(e) => setFormationId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">-- Sélectionner une formation --</option>
            {formations.map((formation) => (
              <option key={formation.id} value={formation.id}>
                {formation.titre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Date début</label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Date fin</label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Heure début</label>
            <input
              type="time"
              value={heureDebut}
              onChange={(e) => setHeureDebut(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Heure fin</label>
            <input
              type="time"
              value={heureFin}
              onChange={(e) => setHeureFin(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Support (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setSupport(e.target.files[0])}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/cours")}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
}
