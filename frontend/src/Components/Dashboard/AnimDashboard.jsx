import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiUser, FiBook, FiCalendar, FiCheckCircle, FiClock,
  FiUsers, FiChevronLeft, FiChevronRight, FiBookOpen
} from 'react-icons/fi';
import { FaChalkboardTeacher, FaRegCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AnimDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const formationsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/animateurDash', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Chargement des données...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-red-50 p-6 rounded-xl shadow-sm max-w-md text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Erreur</h2>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  if (!data) return null;

  const { animateur, stats, formation, recent_sessions } = data;
  
  // Convert single formation to array for pagination
const formations = formation || [];
const indexOfLastFormation = currentPage * formationsPerPage;
const indexOfFirstFormation = indexOfLastFormation - formationsPerPage;
const currentFormations = formations.slice(indexOfFirstFormation, indexOfLastFormation);
const totalPages = Math.ceil(formations.length / formationsPerPage);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with user profile */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bonjour, {animateur?.name.split(' ')[0]}</h1>
            <p className="text-gray-500 text-sm">Voici votre activité récente</p>
          </div>
          <div className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow-sm mt-4 md:mt-0">
            <div className="relative">
              <div className="bg-blue-100 p-2 rounded-full">
                <FiUser className="text-blue-600 text-lg" />
              </div>
              {formation && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {stats?.upcoming_sessions}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{animateur?.name}</p>
              <p className="text-xs text-gray-500">Animateur : {animateur?.matricule}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          <CompactStatCard 
            icon={<FiBook className="text-xl" />}
            title="Formations"
            value={stats?.total_formations}
            color="bg-purple-100"
            iconColor="text-purple-600"
          />
          <CompactStatCard 
            icon={<FaRegCalendarAlt className="text-xl" />}
            title="Cours"
            value={stats?.total_sessions}
            color="bg-blue-100"
            iconColor="text-blue-600"
          />
          <CompactStatCard 
            icon={<FiClock className="text-xl" />}
            title="À Venir"
            value={stats?.upcoming_sessions}
            color="bg-amber-100"
            iconColor="text-amber-600"
          />
          <CompactStatCard 
            icon={<FiCheckCircle className="text-xl" />}
            title="Terminées"
            value={stats?.completed_sessions}
            color="bg-green-100"
            iconColor="text-green-600"
          />
        </motion.div>

        {/* Formations Section */}
         <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaChalkboardTeacher className="mr-2 text-blue-500" />
                Mes Formations ({formations.length})
              </h2>
            </div>
          </div>
          
          <div className="p-4">
            {formations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentFormations.map((formation) => (
                    <CompactFormationCard key={formation.id} formation={formation} />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {formations.length > formationsPerPage && (
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center px-4 py-2 rounded-md text-sm ${
                        currentPage === 1 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <FiChevronLeft className="mr-1" /> Précédent
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`w-8 h-8 rounded-md text-sm flex items-center justify-center ${
                            currentPage === i + 1 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-4 py-2 rounded-md text-sm ${
                        currentPage === totalPages 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Suivant <FiChevronRight className="ml-1" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune formation assignée
              </div>
            )}
          </div>
        </div>

        {/* Recent Cours */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiBookOpen className="mr-2 text-blue-500" />
              Cours Récentes
            </h2>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              {recent_sessions?.length > 0 ? (
                recent_sessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CompactSessionCard session={session} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Aucune session récente
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact Formation Card Component
const CompactFormationCard = ({ formation, highlight = false }) => {
 const statusStyles = {
    'en attente': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'en cours': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'terminée': { bg: 'bg-green-100', text: 'text-green-800' }
  }[formation.status] || { bg: 'bg-gray-100', text: 'text-gray-800' };

  return (
   <Link 
      to={`/formations/${formation.id}`} 
      className={`group block ${highlight ? 'border-2 border-blue-300' : 'border border-gray-200'} rounded-lg p-4 hover:shadow-md transition-all h-full`}
    >
      <motion.div whileHover={{ y: -2 }}>
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-medium ${highlight ? 'text-lg' : 'text-base'} text-gray-800 group-hover:text-blue-600 truncate`}>
            {formation.titre}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs ${statusStyles.bg} ${statusStyles.text}`}>
            {formation.status === 'en attente' ? 'En attente' : 
             formation.status === 'en cours' ? 'En cours' : 
             'Terminée'}
          </span>
        </div>
        
        <p className={`text-gray-600 ${highlight ? 'text-sm' : 'text-xs'} mb-3 line-clamp-2`}>
          {formation.description}
        </p>
        
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <FiUsers className="mr-1" />
          <span>{formation.participant_count} participants</span>
        </div>
        
        {formation.start_date && (
          <div className="flex items-center text-xs text-gray-500">
            <FiCalendar className="mr-1" />
            <span>
              {new Date(formation.start_date).toLocaleDateString('fr-FR', { 
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          </div>
        )}
      </motion.div>
    </Link>
  );
};

// Compact Stat Card Component
const CompactStatCard = ({ icon, title, value, color, iconColor }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className={`${color} rounded-lg shadow-sm p-4`}
  >
    <div className="flex items-center">
      <div className={`p-2 rounded-lg mr-3 ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs">{title}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </motion.div>
);

// Compact Session Card Component
const CompactSessionCard = ({ session }) => {
  const statusStyles = {
    'planifiée': { bg: 'bg-amber-100', text: 'text-amber-800' },
    'en cours': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'terminée': { bg: 'bg-green-100', text: 'text-green-800' }
  }[session.status] || { bg: 'bg-gray-100', text: 'text-gray-800' };

  return (
    <div className="group cursor-pointer">
      <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className={`flex-shrink-0 mt-1 mr-3 ${statusStyles.bg} ${statusStyles.text} rounded-lg p-2 text-xs`}>
          {session.status === 'planifiée' ? '⏱' :
           session.status === 'en cours' ? '▶' : '✓'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate">
              {session.titre}
            </h3>
          </div>
          <p className="text-xs text-gray-600 mb-1 truncate">{session.formation}</p>
          <div className="flex items-center text-xs text-gray-500">
            <FiCalendar className="mr-1" /> 
            {new Date(session.date).toLocaleDateString('fr-FR', { 
              day: 'numeric', month: 'short',
              hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimDashboard;