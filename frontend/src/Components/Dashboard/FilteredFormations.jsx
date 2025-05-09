import React, { useEffect, useState } from 'react';
import axios from 'axios';

const token = localStorage.getItem("token");

export default function FilteredFormations() {
  const [validFormations, setValidFormations] = useState([]);
  const [rejectedFormations, setRejectedFormations] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/formation', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.data.formations) {
        const valid = response.data.formations.filter(f => f.statut === 'validée');
        const rejected = response.data.formations.filter(f => f.statut === 'rejetée');
        setValidFormations(valid);
        setRejectedFormations(rejected);
      }
    })
    .catch(error => {
      console.error('Error fetching formations:', error);
    });
  }, []);

  const renderFormationsTable = (formations, title, statusColor) => (
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
            {formations.map((item) => (
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
        {formations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune formation {title.toLowerCase()} trouvée
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Formations Validées & Rejetées</h2>
      
      {renderFormationsTable(validFormations, "Formations Validées", "bg-green-100 text-green-800")}
      
      {renderFormationsTable(rejectedFormations, "Formations Rejetées", "bg-red-100 text-red-800")}
    </div>
  );
}