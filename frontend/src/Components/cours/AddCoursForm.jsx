import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddCoursForm() {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [formationId, setFormationId] = useState("");
  const [formateurId, setFormateurId] = useState("");
  const [formations, setFormations] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [statut, setStatut] = useState("planifiée");
  const [titre, setTitre] = useState("");

  const [support, setSupport] = useState(); // Fichier support PDF
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resFormations, resFormateurs] = await Promise.all([
    axios.get("http://127.0.0.1:8000/api/formation", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/formateurs-animateurs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFormations(resFormations.data.formations || []);
        setFormateurs(Array.isArray(resFormateurs.data) ? resFormateurs.data : []);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("formation_id", parseInt(formationId));
    formData.append("formateur_animateur_id", parseInt(formateurId));
    formData.append("titre", titre);
    formData.append("dateDebut", dateDebut);
    formData.append("dateFin", dateFin);
    formData.append("heure_debut", heureDebut);
    formData.append("heure_fin", heureFin);
    formData.append("statut", statut);

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
      navigate("/cours");
    } catch (error) {
      console.error("Erreur lors de l’ajout du cours :", error);
      alert("Échec de l’ajout du cours");
    }
  };

  const calculateDuree = () => {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diff = (fin - debut) / (1000 * 60 * 60 * 24);
    return isNaN(diff) ? 0 : diff + 1; // +1 pour inclure le jour de début
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-6">Ajouter Cours</h1>
      <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Formation</label>
          <select
            value={formationId}
            onChange={(e) => setFormationId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">-- Sélectionner une formation --</option>
            {formations.map((f) => (
              <option key={f.id} value={f.id}>
                {f.titre}
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
          <label className="block mb-2 text-sm font-medium text-gray-700">Durée (jours)</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            value={calculateDuree()}
            disabled
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Formateur</label>
            <select
              value={formateurId}
              onChange={(e) => setFormateurId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">-- Sélectionner --</option>
              {formateurs.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.utilisateur?.nom || f.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Statut</label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="planifiée">planifiée</option>
              <option value="en cours">en cours</option>
              <option value="terminée">terminée</option>
              <option value="annulée">annulée</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700"
          htmlFor="support"
          >Support (PDF)</label>
          <input
          id="support"
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
            className="px-6 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
