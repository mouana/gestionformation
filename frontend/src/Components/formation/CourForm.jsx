import React, { useState } from "react";
import "uikit/dist/css/uikit.min.css";

export default function CourForm() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <button className="uk-button uk-button-primary" onClick={() => setShowForm(!showForm)}>
        + Ajouter cours
      </button>
      
      {showForm && (
        <form uk-form-stacked="true" action="" className="uk-margin-top">
          <div className="uk-grid uk-child-width-1-2" data-uk-grid>
            <div>
              <label className="uk-form-label">Durée</label>
              <input className="uk-input" type="number" defaultValue={0} />
            </div>
            <div>
              <label className="uk-form-label">Date début</label>
              <input className="uk-input" type="date" defaultValue="2025-04-20" />
            </div>
          </div>

          <div className="uk-grid uk-child-width-1-2 uk-margin" data-uk-grid>
            <div>
              <label className="uk-form-label">Date fin</label>
              <input className="uk-input" type="date" defaultValue="2025-04-20" />
            </div>
            <div>
              <label className="uk-form-label">Formateur Responsable</label>
              <select className="uk-select">
                <option>Mohamed IBBA-ALI</option>
              </select>
            </div>
          </div>

          <div className="uk-margin">
            <label className="uk-form-label">Formateurs participants</label>
            <input className="uk-input" type="text" placeholder="Sélectionner les formateurs participants" />
          </div>

          <div className="uk-flex uk-flex-between uk-margin-top">
            <button type="button" className="uk-button uk-button-default" onClick={() => setShowForm(false)}>
              Annuler
            </button>
            <button className="uk-button uk-button-primary">Enregistrer</button>
          </div>
        </form>
      )}
    </div>
  );
}