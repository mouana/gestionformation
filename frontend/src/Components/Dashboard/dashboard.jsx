import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import {
  FaUserTie,
  FaUsers,
  FaChartLine,
  FaClock,
  FaCog,
  FaPowerOff,
} from 'react-icons/fa';
import { MdDashboard, MdEmail, MdCalendarToday } from 'react-icons/md';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  const data = {
    labels: Array.from({ length: 60 }, (_, i) => `${(i + 1) * 1000}`),
    datasets: [
      {
        label: 'Sales %',
        data: Array.from({ length: 60 }, () => Math.random() * 100),
        borderColor: '#3b82f6',
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (val) => `${val}%` } },
    },
  };

  const cards = [
    { label: 'Total Formateurs', value: '40,689', icon: <FaUserTie />, trend: '+8.5% Up from yesterday', color: 'text-green-500' },
    { label: 'Total Animateurs', value: '10,293', icon: <FaUsers />, trend: '+1.3% Up from past week', color: 'text-green-400' },
    { label: 'Total Formations', value: '$89,000', icon: <FaChartLine />, trend: '-4.3% Down from yesterday', color: 'text-red-500' },
    { label: 'Total CDC', value: '2040', icon: <FaClock />, trend: '+1.8% Up from yesterday', color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
  

      <main className="flex-1 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">English</span>
            <img src="https://flagcdn.com/gb.svg" alt="EN" className="w-6 h-4" />
            <img
              src="https://randomuser.me/api/portraits/women/65.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-sm text-gray-500">{card.label}</div>
                <div className="text-xl font-semibold">{card.value}</div>
                <div className={`text-xs mt-1 ${card.color}`}>{card.trend}</div>
              </div>
              <div className="text-2xl text-gray-400">{card.icon}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex justify-between mb-2">
            <h2 className="text-lg font-semibold">Sales Details</h2>
            <select className="border rounded px-2 py-1 text-sm">
              <option>October</option>
            </select>
          </div>
          <div className="h-64">
            <Line data={data} options={options} />
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }) {
  return (
    <div
      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-100 transition-colors ${
        active ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
      }`}
    >
      {icon && <div className="mr-2 text-lg">{icon}</div>}
      {label}
    </div>
  );
}
