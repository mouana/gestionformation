import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FiCalendar, FiClock, FiBook, FiAlertCircle, FiLoader, FiLink, FiUser, FiInfo } from 'react-icons/fi';
import Swal from 'sweetalert2';

const CalendrierCours = () => {
  const [cours, setCours] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const utilisateur = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/cours', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const coursFiltres = data?.cours?.filter(cours => 
          cours?.formateur_animateur?.utilisateur?.id === utilisateur?.id
        ) || [];
        setCours(coursFiltres);
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    };

    if (utilisateur) fetchCours();
  }, [utilisateur]);

  const getCouleurStatut = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'en cours': return '#3b82f6';       // blue-500
      case 'planifiée': return '#10b981';      // emerald-500
      case 'validée': return '#8b5cf6';        // violet-500
      case 'en attente': return '#f59e0b';     // amber-500
      default: return '#6b7280';               // gray-500
    }
  };

  const formaterCoursPourCalendrier = () => {
    return cours.map(cours => {
      const formateur = cours?.formateur_animateur?.utilisateur || {};
      return {
        id: cours.id,
        title: cours.titre,
        start: `${cours.dateDebut}T${cours.heure_debut}`,
        end: `${cours.dateFin}T${cours.heure_fin}`,
        extendedProps: {
          formation: cours?.formation?.titre || 'Non disponible',
          idFormateur: formateur.id,
          nomFormateur: formateur.nom,
          emailFormateur: formateur.email,
          support: cours.support_url,
          statut: cours.statut
        },
        backgroundColor: getCouleurStatut(cours.statut),
        borderColor: getCouleurStatut(cours.statut),
        textColor: '#ffffff',
        classNames: ['cours-utilisateur-actuel'],
        borderWidth: 2,
        display: 'block'
      };
    });
  };

  const renderContenuEvenement = (infosEvenement) => {
    const { event } = infosEvenement;
    const { formation } = event.extendedProps;

    return (
      <div className="p-2">
        <div className="font-semibold truncate">{event.title}</div>
        <div className="flex items-center text-xs mt-1">
          <FiClock className="mr-1" />
          {infosEvenement.timeText}
        </div>
        <div className="flex items-center text-xs mt-1">
          <FiBook className="mr-1" />
          {formation}
        </div>
      </div>
    );
  };

  const showEventDetails = (event) => {
    const supportUrl = event.extendedProps.support 
      ? `${window.location.origin}${event.extendedProps.support}` 
      : 'Aucun support disponible';
    
    const statusColor = getCouleurStatut(event.extendedProps.statut);
    
    Swal.fire({
      title: event.title,
      html: `
        <div class="text-left">
          <div class="flex items-center mb-2">
            <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${statusColor}"></div>
            <span class="font-medium">${event.extendedProps.statut}</span>
          </div>
          <div class="mb-2 flex items-center">
            <i class="mr-2">${event.start.toLocaleString()}</i>
            <span>à</span>
            <i class="ml-2">${event.end.toLocaleString()}</i>
          </div>
          <div class="mb-2 flex items-center">
            <span class="font-medium mr-2">Formation:</span>
            <span>${event.extendedProps.formation}</span>
          </div>
          <div class="mb-2 flex items-center">
            <span class="font-medium mr-2">Support:</span>
            <a href="${supportUrl}" target="_blank" class="text-blue-500 hover:underline">${supportUrl}</a>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '600px',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl shadow-lg',
        title: 'text-2xl font-bold text-gray-800 mb-4',
        closeButton: 'text-gray-400 hover:text-gray-600'
      }
    });
  };

  if (chargement) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Chargement de vos cours...</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <FiAlertCircle className="text-red-500 text-3xl" />
        </div>
        <h2 className="text-xl font-bold text-red-600 mb-2">Erreur de chargement</h2>
        <p className="text-gray-600 text-center max-w-md">{erreur}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FiCalendar className="mr-3 text-blue-500" />
              Mon Emploi du temps
            </h1>
            <p className="text-gray-500 mt-1">
              {cours.length} cours à venir
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex flex-wrap gap-2">
              {[
                { color: 'bg-blue-500', label: 'En cours' },
                { color: 'bg-emerald-500', label: 'Planifiée' },
                { color: 'bg-violet-500', label: 'Validée' },
                { color: 'bg-amber-500', label: 'En attente' }
              ].map((item, index) => (
                <div key={index} className="flex items-center px-3 py-1 bg-white rounded-full shadow-sm">
                  <div className={`w-3 h-3 ${item.color} rounded-full mr-2`}></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            locale="fr"
            buttonText={{
              today: "Aujourd'hui",
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour'
            }}
            events={formaterCoursPourCalendrier()}
            eventContent={renderContenuEvenement}
            height="600px"
            nowIndicator={true}
            editable={false}
            selectable={false}
            dayHeaderFormat={{ weekday: 'long', day: 'numeric' }}
            dayHeaderClassNames="bg-gray-50 text-gray-700 font-medium"
            dayCellClassNames="hover:bg-gray-50"
            eventClassNames="hover:shadow-md cursor-pointer transition-all"
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            eventClick={(info) => {
              info.jsEvent.preventDefault();
              showEventDetails(info.event);
            }}
          />
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FiLoader className="mr-2 text-blue-500" />
            Statistiques rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { 
                count: cours.filter(c => c.statut?.toLowerCase() === 'en cours').length, 
                label: 'En cours',
                color: 'bg-blue-100 text-blue-600'
              },
              { 
                count: cours.filter(c => c.statut?.toLowerCase() === 'planifiée').length, 
                label: 'Planifiée',
                color: 'bg-emerald-100 text-emerald-600'
              },
              { 
                count: cours.filter(c => c.statut?.toLowerCase() === 'validée').length, 
                label: 'Validée',
                color: 'bg-violet-100 text-violet-600'
              },
              { 
                count: cours.filter(c => c.statut?.toLowerCase() === 'en attente').length, 
                label: 'En attente',
                color: 'bg-amber-100 text-amber-600'
              }
            ].map((stat, index) => (
              <div key={index} className={`p-4 rounded-lg ${stat.color} flex flex-col`}>
                <span className="text-3xl font-bold mb-1">{stat.count}</span>
                <span className="text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendrierCours;