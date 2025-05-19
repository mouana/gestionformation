import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDownload, FiCalendar, FiClock, FiUser, FiBook, FiInfo } from 'react-icons/fi';

const CoursList = () => {
  const [cours, setCours] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://127.0.0.1:8000/api/cours", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setCours(response.data.cours);
        setChargement(false);
      } catch (err) {
        setErreur(err.message);
        setChargement(false);
      }
    };

    fetchCours();
  }, []);

  const telechargerSupport = (supportUrl, titre) => {
    const link = document.createElement('a');
    link.href = `http://127.0.0.1:8000${supportUrl}`;
    link.download = `Support-${titre}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formaterDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formaterHeure = (heureString) => {
    return heureString.substring(0, 5);
  };

  const filteredCours = cours.filter(cour => {
    const matchesSearch = cour.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cour.formation?.titre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || cour.statut === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (chargement) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur lors du chargement des cours</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{erreur}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Cours</h1>
          <p className="mt-2 text-sm text-gray-600">Consultez tous vos cours programmés</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="planifiée">Planifiée</option>
            <option value="en cours">En cours</option>
            <option value="terminée">Terminée</option>
          </select>
        </div>
      </div>
      
      {filteredCours.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun cours trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? "Essayez de modifier vos critères de recherche" 
              : "Vous n'avez aucun cours programmé pour le moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCours.map((cour) => (
            <div key={cour.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{cour.titre}</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cour.statut === 'en cours' ? 'bg-blue-100 text-blue-800' :
                      cour.statut === 'planifiée' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {cour.statut}
                    </span>
                  </div>
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <FiBook className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-start text-sm text-gray-600">
                    <FiUser className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" />
                    <span>Formateur: {cour.formateur_animateur?.utilisateur?.nom || 'Non spécifié'}</span>
                  </div>
                  
                  <div className="flex items-start text-sm text-gray-600">
                    <FiCalendar className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" />
                    <span>{formaterDate(cour.dateDebut)} - {formaterDate(cour.dateFin)}</span>
                  </div>
                  
                  <div className="flex items-start text-sm text-gray-600">
                    <FiClock className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" />
                    <span>{formaterHeure(cour.heure_debut)} - {formaterHeure(cour.heure_fin)}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between space-x-3">
                  <button 
                    onClick={() => telechargerSupport(cour.support_url, cour.titre)}
                    disabled={!cour.support_url}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                      cour.support_url 
                        ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <FiDownload className="-ml-0.5 mr-2 h-4 w-4" />
                    Support
                  </button>
                
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursList;