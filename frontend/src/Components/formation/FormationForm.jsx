import React from "react";
import "uikit/dist/css/uikit.min.css";

const FormationForm = () => {
  return (
    <div className="uk-container uk-margin-large-top">
      <h2 className="uk-heading-medium">Ajouter formation</h2>
      <form className="uk-form-stacked">
        <div className="uk-margin">
          <label className="uk-form-label">Titre</label>
          <input className="uk-input" type="text" placeholder="Value" />
        </div>
        
        <div className="uk-margin">
          <label className="uk-form-label">Description</label>
          <textarea className="uk-textarea" placeholder="Value"></textarea>
        </div>
        
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
          <label className="uk-form-label">Statuts</label>
          <select className="uk-select">
            <option>Drafts</option>
          </select>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label">Formateurs participants</label>
          <input className="uk-input" type="text" placeholder="Sélectionner les formateurs participants" />
        </div>

        <div className="uk-flex uk-flex-between uk-margin-top">
          <button className="uk-button uk-button-default">Annuler</button>
          <button className="uk-button uk-button-primary">Enregistrer</button>
        </div>
      </form>
    </div>
  );
};

export default FormationForm;
 