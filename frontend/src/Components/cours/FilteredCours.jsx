import React, { useEffect, useState } from 'react';
import axios from 'axios';

const token = localStorage.getItem("token");

export default function FilteredCours() {
  const [validCours, setValidCours] = useState([]);
  const [rejectedCours, setRejectedCours] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/cours', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.data.cours) {
        const valid = response.data.cours.filter(c => c.statut === 'planifiée');
        const rejected = response.data.cours.filter(c => c.statut === 'terminée');
        setValidCours(valid);
        setRejectedCours(rejected);
      }
    })
    .catch(error => {
      console.error('Erreur lors du chargement des cours :', error);
    });
  }, []);

  const renderCoursTable = (cours, title, statusColor) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cours.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.titre}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                    {item.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cours.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun cours {title.toLowerCase()} trouvé
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Cours Validés & Rejetés</h2>
      {renderCoursTable(validCours, "Cours planifiée", "bg-green-100 text-green-800")}
      {renderCoursTable(rejectedCours, "Cours terminée", "bg-red-100 text-red-800")}
    </div>
  );
}
