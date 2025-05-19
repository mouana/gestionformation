import React, { useState, useEffect } from 'react';
import { FaDownload, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PresenceList = () => {
  const [presence, setPresence] = useState([]);
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');
  const { id } = useParams();

  useEffect(() => {
    const fetchFormationAndParticipants = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/formations/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const formationData = res.data.formation;
        setFormation(formationData);
        
        const participants = formationData.participants || [];
        const initialPresence = participants.map(p => ({
          id: p.id,
          name: p.utilisateur.nom,
          ISTA: p.ISTA,
          region: p.region,
          ville: p.ville,
          email: p.utilisateur.email,
          present: false,
        }));
        
        setPresence(initialPresence);
      } catch (error) {
        console.error('Erreur lors de la récupération des participants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormationAndParticipants();
  }, [id, token]);

  const togglePresence = (id) => {
    setPresence(prev =>
      prev.map(p => (p.id === id ? { ...p, present: !p.present } : p))
    );
  };

  const filteredParticipants = presence.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.ISTA.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headers = [
    { label: 'Nom', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'ISTA', key: 'ISTA' },
    { label: 'Région', key: 'region' },
    { label: 'Ville', key: 'ville' },
    { label: 'Présence', key: 'presentText' },
  ];

  const dataToDownload = presence.map(p => ({
    ...p,
    presentText: p.present ? 'Présent' : 'Absent',
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="mt-10 text-center p-6 bg-red-50 rounded-lg">
        <h2 className="text-xl font-semibold text-red-600">Formation non trouvée</h2>
        <p className="text-gray-600 mt-2">La formation demandée n'existe pas ou n'est pas accessible.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Formation Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h1 className="text-2xl md:text-3xl text-white font-bold">{formation.titre}</h1>
          <p className="mt-2 opacity-90">{formation.description}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <span className="bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full">
              Statut: {formation.statut}
            </span>
            <span className="bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full">
              Animateur: {formation.animateur.utilisateur.nom}
            </span>
          </div>
        </div>

        {/* Participants Section */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Liste de présence ({filteredParticipants.length} participants)
            </h2>
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un participant..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
             <CSVLink
  data={dataToDownload}
  headers={headers}
  filename={`liste_presence_${formation.titre}.csv`}
  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white hover:text-white no-underline hover:no-underline text-sm font-medium rounded-lg transition-colors"
>
  <FaDownload /> Exporter
</CSVLink>
            </div>
          </div>

          {/* Participants Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISTA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Présence
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {p.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{p.name}</div>
                            <div className="text-sm text-gray-500">{p.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {p.ISTA}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{p.ville}</div>
                        <div className="text-sm text-gray-500">{p.region}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => togglePresence(p.id)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            p.present
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {p.present ? (
                            <>
                              <FaUserCheck /> Présent
                            </>
                          ) : (
                            <>
                              <FaUserTimes /> Absent
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      Aucun participant trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-green-50 px-4 py-3 rounded-lg flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <FaUserCheck className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Présents</p>
                <p className="font-bold text-green-700">
                  {presence.filter(p => p.present).length}
                </p>
              </div>
            </div>
            <div className="bg-red-50 px-4 py-3 rounded-lg flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <FaUserTimes className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Absents</p>
                <p className="font-bold text-red-700">
                  {presence.filter(p => !p.present).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenceList;