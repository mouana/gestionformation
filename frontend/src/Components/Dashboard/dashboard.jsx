import React, { useEffect, useState } from 'react';
import { FiUsers, FiBook, FiAward, FiHome, FiDownload } from 'react-icons/fi';
import { FaChalkboardTeacher, FaUserTie } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_formations: 0,
    total_animateurs: 0,
    total_cdc: 0,
    total_drif: 0,
    formations: []
  });
  const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/admin/dashboard'
          , {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await response.json();
    console.log(data)
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FiBook className="text-blue-500 text-2xl" />} 
          title="Total Formations" 
          value={stats.total_formations} 
          color="bg-blue-100" 
        />
        <StatCard 
          icon={<FaChalkboardTeacher className="text-green-500 text-2xl" />} 
          title="Total Animateurs" 
          value={stats.total_animateurs} 
          color="bg-green-100" 
        />
        <StatCard 
          icon={<FaUserTie className="text-purple-500 text-2xl" />} 
          title="Total CDC" 
          value={stats.total_cdc} 
          color="bg-purple-100" 
        />
        <StatCard 
          icon={<FiHome className="text-orange-500 text-2xl" />} 
          title="Total DRIF" 
          value={stats.total_drif} 
          color="bg-orange-100" 
        />
      </div>

      {/* Formations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Formations Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.formations.map((formation) => (
                <tr key={formation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formation.titre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formation.animateur}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {formation.course_count} courses
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      formation.status === 'terminée' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {formation.status
}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`${color} p-6 rounded-lg shadow`}>
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-white mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;