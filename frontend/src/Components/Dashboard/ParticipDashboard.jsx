import React, { useEffect, useState } from 'react';
import { FiBook, FiDownload, FiUser, FiCalendar } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';

const ParticipDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    participant: {
      id: null,
      name: '',
      email: '',
      role: ''
    },
    formations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/participant/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching participant dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async (courseId, fileName) => {
    try {
      const response = await fetch(`/api/participant/courses/${courseId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `course-material-${courseId}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow">
          <FiUser className="text-blue-500" />
          <span className="font-medium">{dashboardData.participant.name}</span>
        </div>
      </div>

      <div className="space-y-8">
        {dashboardData.formations.length > 0 ? (
  dashboardData.formations
    .filter((formation) => formation.statut === 'validée')
    .map((formation) => (
            <div key={formation.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{formation.titre}</h2>
                    <p className="text-blue-100">{formation.description}</p>
                  </div>
                  <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    {formation.statut}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <FaChalkboardTeacher className="text-gray-500 mr-2" />
                    <span className="text-gray-700">Animateur: {formation.animateur.nom}</span>
                  </div>
                  <div className="flex items-center">
                                        <FaChalkboardTeacher className="text-gray-500 mr-2" />
                    <span className="text-gray-700"> Email: {formation.animateur.email}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-800 mb-3">Cours</h3>
                <div className="space-y-3">
                  {formation.courses.length > 0 ? (
                    formation.courses.map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{course.titre}</h4>
                            <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                              <FiCalendar className="mr-1" />
                              <span>
                                {new Date(course.date_debut).toLocaleDateString()} - {new Date(course.date_fin).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {course.support && (
                            <button
                              onClick={() => handleDownload(course.id, course.support.name)}
                              className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                            >
                              <FiDownload className="mr-1" />
                              {course.support.size ? `Download (${course.support.size})` : 'Download'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No courses available for this formation yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">You are not enrolled in any formations yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipDashboard;