import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiUser, FiBook, FiCalendar, FiCheckCircle, FiClock,
  FiUsers, FiMapPin, FiHome, FiBookOpen, FiAward
} from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';

const AnimDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">
      Erreur: {error}
    </div>
  );

  if (!data) return null;

  const { animateur, stats, formation, recent_sessions } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
        <div className="flex items-center space-x-4 bg-blue-50 p-3 rounded-lg">
          <div className="bg-blue-100 p-2 rounded-full">
            <FiUser className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{animateur?.name}</p>
            <p className="text-sm text-gray-500">Matricule: {animateur?.matricule}</p>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FiBook className="text-2xl" />}
          title="Formations Totales"
          value={stats?.total_formations}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard 
          icon={<FiCalendar className="text-2xl" />}
          title="Sessions Totales"
          value={stats?.total_sessions}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard 
          icon={<FiClock className="text-2xl" />}
          title="Sessions à Venir"
          value={stats?.upcoming_sessions}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard 
          icon={<FiCheckCircle className="text-2xl" />}
          title="Sessions Terminées"
          value={stats?.completed_sessions}
          color="bg-green-100 text-green-600"
        />
      </div>

      {/* Formation actuelle et sessions récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Formation actuelle */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaChalkboardTeacher className="mr-2 text-blue-500" />
              Formation Actuelle
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              formation?.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
              formation?.status === 'en cours' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {formation?.status === 'en attente' ? 'En attente' : 
               formation?.status === 'en cours' ? 'En cours' : 
               formation?.status}
            </span>
          </div>
          
          <h3 className="text-lg font-medium text-gray-800 mb-2">{formation?.titre}</h3>
          <p className="text-gray-600 mb-4">{formation?.description}</p>
          
          <div className="flex items-center mb-6">
            <div className="flex items-center mr-6">
              <FiUsers className="text-gray-500 mr-2" />
              <span className="text-gray-700">{formation?.participant_count} Participants</span>
            </div>
            {formation?.start_date && (
              <div className="flex items-center">
                <FiCalendar className="text-gray-500 mr-2" />
                <span className="text-gray-700">
                  {new Date(formation.start_date).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </div>
          
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <FiUsers className="mr-2" /> Participants
          </h4>
          <div className="space-y-3">
            {formation?.participants?.map(participant => (
              <ParticipantCard key={participant.id} participant={participant} />
            ))}
          </div>
        </div>

        {/* Sessions récentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiBookOpen className="mr-2 text-blue-500" />
            Cours Récentes
          </h2>
          <div className="space-y-4">
            {recent_sessions?.map(session => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Carte de Statistique
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Composant Carte de Participant
const ParticipantCard = ({ participant }) => (
  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
    <div className="bg-blue-100 p-2 rounded-full mr-3">
      <FiUser className="text-blue-600" />
    </div>
    <div className="flex-1">
      <p className="font-medium text-gray-800">{participant.name}</p>
      <div className="flex flex-wrap text-xs text-gray-500 mt-1">
        <span className="flex items-center mr-3">
          <FiAward className="mr-1" /> {participant.ISTA}
        </span>
        <span className="flex items-center mr-3">
          <FiMapPin className="mr-1" /> {participant.ville}
        </span>
        <span className="flex items-center">
          <FiHome className="mr-1" /> {participant.region}
        </span>
      </div>
    </div>
  </div>
);

// Composant Carte de Session
const SessionCard = ({ session }) => {
  const getStatusText = (status) => {
    switch(status) {
      case 'planifiée': return 'Planifiée';
      case 'en cours': return 'En cours';
      case 'terminée': return 'Terminée';
      default: return status;
    }
  };

  return (
    <div className="border-l-4 border-blue-500 pl-4 py-2">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800">{session.titre}</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${
          session.status === 'planifiée' ? 'bg-yellow-100 text-yellow-800' :
          session.status === 'en cours' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {getStatusText(session.status)}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{session.formation}</p>
      <p className="text-xs text-gray-500 flex items-center">
        <FiCalendar className="mr-1" /> 
        {new Date(session.date).toLocaleDateString('fr-FR', { 
          day: 'numeric', month: 'long', year: 'numeric'
        })}
      </p>
    </div>
  );
};

export default AnimDashboard;