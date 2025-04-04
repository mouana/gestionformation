import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import "uikit/dist/css/uikit.min.css";
import FormationForm from "./FormationForm";

export default function FormationList() {
    const [formations, setFormations] = useState([]);
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        
        if (!user) {
            navigate("/");
            return;
        }

        // Check if user has permission (example: "admin" or "respancable_formation" role)
        // if (user.role !== "respancable_formation") {
        //     alert("Vous n'avez pas la permission d'accéder à cette page.");
        //     navigate("/");
        //     return;
        // }

        // Fetch formations if user is authorized using Axios
        axios
  .get("http://127.0.0.1:8000/api/formation", {
    headers: {
      "Authorization": `Bearer ${user.token}`,
      "Accept": "application/json",
    },
  })
  .then((response) => {
    console.log("API Response:", response); 
    console.log("Formations data:", response.data.formations);
    setFormations(response.data.formations); 
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des formations:", error);
  });

    }, [user, navigate]);

    return (
        <div className="uk-margin-top">
            <h3>Liste des formations</h3>
            {formations.length > 0 ? (
                <ul className="uk-list uk-list-divider">
                    {formations.map((formation) => (
                        <li key={formation.id}>
                            <strong>{formation.titre}</strong> - {formation.statut}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune formation existante.</p>
            )}
            <FormationForm />
        </div>
    );
}
