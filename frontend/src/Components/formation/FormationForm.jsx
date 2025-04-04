import React, { useState, useEffect } from "react";
import "uikit/dist/css/uikit.min.css";
import CourForm from "./CourForm";
import axios from "axios";
import { useSelector } from "react-redux";

const FormationForm = () => {
  const user = useSelector((state) => state.auth.user); // Avoid destructuring directly to prevent unnecessary re-renders
  const [showForm, setShowForm] = useState(false);
  const [formationTitle, setFormationTitle] = useState("");
  const [formationStatus, setFormationStatus] = useState("");
  const [formationDescription, setFormationDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false); // State for user authorization

  useEffect(() => {
    if (user) {
      setIsAuthorized(true); // Set authorization state only once when user data is available
    }
  }, [user]);

  // Handle form submission and API call
  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No token found, please log in.");
      return;
    }

    const data = {
      titre: formationTitle,
      description: formationDescription,
      statut: formationStatus,
    };

    axios
      .post("http://127.0.0.1:8000/api/add-formation", data, {
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        console.log("Formation added successfully:", response.data);
        setFormationTitle("");
        setFormationStatus("");
        setFormationDescription("");
        setSubmitted(true);
        setShowForm(false); // Close the form after successful submission
      })
      .catch((error) => {
        console.error("There was an error adding the formation:", error.response?.data || error.message);
      });
  };

  if (!isAuthorized) {
    return (
      <div className="uk-container uk-margin-large-top">
        <p>Vous n'êtes pas autorisé à accéder à cette page. Veuillez vous connecter avec le rôle approprié.</p>
      </div>
    );
  }

  return (
    <div className="uk-container uk-margin-large-top">
      <button className="uk-button uk-button-primary" onClick={() => setShowForm(!showForm)}>
        + Ajouter formation
      </button>

      {showForm && (
        <form uk-form-stacked="true" className="uk-margin-top" onSubmit={handleSubmit}>
          <div className="uk-margin">
            <label className="uk-form-label">Titre</label>
            <input
              className="uk-input"
              type="text"
              value={formationTitle}
              onChange={(e) => setFormationTitle(e.target.value)}
              placeholder="Titre de la formation"
              required
            />
          </div>

          <div className="uk-margin">
            <label className="uk-form-label">Description</label>
            <textarea
              className="uk-textarea"
              value={formationDescription}
              onChange={(e) => setFormationDescription(e.target.value)}
              placeholder="Description de la formation"
              required
            />
          </div>

          <div className="uk-margin">
            <label className="uk-form-label">Statut</label>
            <select
              className="uk-select"
              value={formationStatus}
              onChange={(e) => setFormationStatus(e.target.value)}
              required
            >
              <option value="" disabled>Choisissez un statut</option>
              <option value="en cour">En cours</option>
              <option value="terminée">Terminée</option>
              <option value="en attente">En attente</option>
            </select>
          </div>

          <div className="uk-flex uk-flex-between uk-margin-top">
            <button
              type="button"
              className="uk-button uk-button-default"
              onClick={() => setShowForm(false)}
            >
              Annuler
            </button>
            <button type="submit" className="uk-button uk-button-primary">
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className="uk-margin-top">
          <h3>{formationTitle}</h3>
          <p><strong>Statut:</strong> {formationStatus}</p>
          <p><strong>Description:</strong> {formationDescription}</p>
          <CourForm /> 
        </div>
      )}
    </div>
  );
};

export default FormationForm;
