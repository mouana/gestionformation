import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaUserPlus,
  FaDownload,
} from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import Swal from "sweetalert2";

const statusColor = {
  planifiée: "bg-green-100 text-green-700",
  "en cours": "bg-purple-100 text-purple-700",
  terminée: "bg-orange-100 text-orange-700",
  annulée: "bg-pink-100 text-pink-700",
};

const token = localStorage.getItem("token");

export default function CoursPage() {
  const [cours, setCours] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedCour, setEditedCour] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("titre");
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchCours();
  }, []);

  const fetchCours = () => {
    axios
      .get("http://127.0.0.1:8000/api/cours", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((response) => {
        if (response.data.cours) {
          setCours(response.data.cours);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des cours:", error);
        Swal.fire({
          title: "Erreur",
          text: "Échec du chargement des cours",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas annuler cette action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8000/api/delete-cour/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setCours(cours.filter((c) => c.id !== id));
            Swal.fire("Supprimé!", "Le cours a été supprimé.", "success");
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression du cours:", error);
            Swal.fire({
              title: "Erreur",
              text: "Échec de la suppression du cours",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  const handleEdit = (cour) => {
    setEditId(cour.id);
    setEditedCour({
      titre: cour.titre || "",
      formation_id: cour.formation?.id || "",
      formateur_animateur_id: cour.formateur_animateur?.id || "",
      dateDebut: cour.dateDebut || "",
      dateFin: cour.dateFin || "",
      heure_debut: cour.heure_debut || "",
      heure_fin: cour.heure_fin || "",
      statut: cour.statut || "",
      support: null, // Reset file input
    });
  };

  const handleChange = (field, value) => {
    setEditedCour((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setEditedCour((prev) => ({
      ...prev,
      support: e.target.files[0],
    }));
  };

  const handleSave = (id) => {
    const formData = new FormData();

    // Append all fields safely
    formData.append("titre", editedCour.titre || "");
    formData.append("formation_id", editedCour.formation_id || "");
    formData.append("formateur_animateur_id", editedCour.formateur_animateur_id || "");
    formData.append("dateDebut", editedCour.dateDebut || "");
    formData.append("dateFin", editedCour.dateFin || "");
    formData.append("heure_debut", editedCour.heure_debut || "");
    formData.append("heure_fin", editedCour.heure_fin || "");
    formData.append("statut", editedCour.statut || "");

    // Only append the file if a new one was selected
    if (editedCour.support instanceof File) {
      formData.append("support", editedCour.support);
    }

    axios
      .put(`http://127.0.0.1:8000/api/update-cour/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success) {
          setCours(cours.map((c) => (c.id === id ? response.data.cour : c)));
          setEditId(null);
          setEditedCour({});
          Swal.fire({
            title: "Succès",
            text: "Le cours a été mis à jour avec succès",
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchCours(); // Refresh list
        } else {
          throw new Error(response.data.message || "Échec de la mise à jour");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du cours:", error);
        Swal.fire({
          title: "Erreur",
          text:
            error.response?.data?.message ||
            "Échec de la mise à jour du cours",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditedCour({});
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterField("titre");
    setFilterValue("");
    setStatusFilter("");
  };

  const filteredCours = cours.filter((cour) => {
    const matchesSearch =
      searchTerm === "" ||
      cour.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cour.formation?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cour.formateur_animateur?.utilisateur?.nom
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cour.statut.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesField =
      filterValue === "" ||
      String(cour[filterField])
        .toLowerCase()
        .includes(filterValue.toLowerCase());

    const matchesStatus = statusFilter === "" || cour.statut === statusFilter;

    return matchesSearch && matchesField && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Cours</h1>
            <p className="mt-1 text-sm text-gray-500">
              Liste complète des sessions de cours
            </p>
          </div>
          <Link to="/ajoutercour" className="mt-4 md:mt-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
              <FaUserPlus /> Ajouter un Cours
            </button>
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par titre, formation, formateur ou statut..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center border px-3 py-2 rounded-md bg-white gap-2 text-sm text-gray-600">
                <FaFilter /> <span>Filtrer par</span>
              </div>
              <select
                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
              >
                <option value="titre">Titre</option>
                <option value="formation.titre">Formation</option>
                <option value="formateur_animateur.utilisateur.nom">
                  Formateur
                </option>
                <option value="dateDebut">Date Début</option>
              </select>
              <input
                type="text"
                placeholder="Valeur du filtre..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <select
                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="planifiée">Planifiée</option>
                <option value="en cours">En cours</option>
                <option value="terminée">Terminée</option>
                <option value="annulée">Annulée</option>
              </select>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      ID
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Titre
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Formation
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Formateur
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Date Début
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Date Fin
    </th>
    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Heure
    </th> */}
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Statut
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Support
    </th>
    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
      Actions
    </th>
  </tr>
</thead>
              <tbody className="bg-white divide-y divide-gray-200">
  {filteredCours.length > 0 ? (
    filteredCours.map((item) => (
      <tr key={item.id} className="hover:bg-gray-50">
        {/* ID Column */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {item.id}
        </td>

        {/* Titre Column */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {editId === item.id ? (
            <input
              type="text"
              value={editedCour.titre || ""}
              onChange={(e) => handleChange("titre", e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            item.titre
          )}
        </td>

        {/* Formation Column */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {editId === item.id ? (
            <input
              type="text"
              value={editedCour.formation_id || ""}
              onChange={(e) => handleChange("formation_id", e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            item.formation?.titre
          )}
        </td>

        {/* Formateur Column */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {editId === item.id ? (
            <input
              type="text"
              value={editedCour.formateur_animateur_id || ""}
              onChange={(e) =>
                handleChange("formateur_animateur_id", e.target.value)
              }
              className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            item.formateur_animateur?.utilisateur?.nom
          )}
        </td>

        {/* Date Début Column */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {editId === item.id ? (
            <input
              type="date"
              value={editedCour.dateDebut || ""}
              onChange={(e) => handleChange("dateDebut", e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            item.dateDebut
          )}
        </td>

        {/* Date Fin Column */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {editId === item.id ? (
            <input
              type="date"
              value={editedCour.dateFin || ""}
              onChange={(e) => handleChange("dateFin", e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            item.dateFin
          )}
        </td>

        {/* Heure Column */}
        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {editId === item.id ? (
            <div className="space-y-1">
              <input
                type="time"
                value={editedCour.heure_debut || ""}
                onChange={(e) => handleChange("heure_debut", e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="time"
                value={editedCour.heure_fin || ""}
                onChange={(e) => handleChange("heure_fin", e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ) : (
            `${item.heure_debut} - ${item.heure_fin}`
          )}
        </td> */}

        {/* Statut Column */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {editId === item.id ? (
            <select
              value={editedCour.statut || ""}
              onChange={(e) => handleChange("statut", e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="planifiée">Planifiée</option>
              <option value="en cours">En cours</option>
              <option value="terminée">Terminée</option>
              <option value="annulée">Annulée</option>
            </select>
          ) : (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                statusColor[item.statut] || "bg-gray-100 text-gray-600"
              }`}
            >
              {item.statut}
            </span>
          )}
        </td>

        {/* Support Column */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {editId === item.id ? (
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm"
            />
          ) : item.support_url ? (
            <a
              href={`http://127.0.0.1:8000${item.support_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <FaDownload className="text-xs" /> Télécharger
            </a>
          ) : (
            "Aucun"
          )}
        </td>

        {/* Actions Column */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          {editId === item.id ? (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleSave(item.id)}
                className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 transition-colors"
              >
                Enregistrer
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          ) : (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors min-w-[2.5rem]"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50 transition-colors min-w-[2.5rem]"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="10"
        className="px-6 py-4 text-center text-sm text-gray-500"
      >
        Aucun cours trouvé
      </td>
    </tr>
  )}
</tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredCours.length > 0 && (
          <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de{" "}
                  <span className="font-medium">1</span> à{" "}
                  <span className="font-medium">{filteredCours.length}</span> sur{" "}
                  <span className="font-medium">{filteredCours.length}</span>{" "}
                  résultats
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Précédent</span>
                    <IoIosArrowBack className="h-4 w-4" />
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Suivant</span>
                    <IoIosArrowForward className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}