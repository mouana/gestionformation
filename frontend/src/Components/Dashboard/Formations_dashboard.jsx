import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const statusColor = {
  'terminée': 'bg-green-100 text-green-700',
  'en cour': 'bg-purple-100 text-purple-700',
  'rejetée': 'bg-red-100 text-red-700',
  'en attente': 'bg-orange-100 text-orange-700',
  'en transit': 'bg-pink-100 text-pink-700',
};
const token = localStorage.getItem("token"); 

export default function FormationsPage() {
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/formation',{
      headers: {
        Authorization: `Bearer ${token}`
      }
      
    })
      .then(response => {
        if (response.data.formations) {
          setFormations(response.data.formations);
        }
      })
      .catch(error => {
        console.error('Error fetching formations:', error);
      });
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Formations</h2>
        <Link to="/ajouterformation">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Formation
          </button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-md shadow mb-4 flex flex-wrap gap-2 items-center">
        <button className="flex items-center px-3 py-1.5 border rounded text-gray-600 hover:bg-gray-100">
          <span className="mr-1">🔍</span> Filter By
        </button>
        <select className="border px-3 py-1.5 rounded text-gray-600">
          <option>Date</option>
        </select>
        <select className="border px-3 py-1.5 rounded text-gray-600">
          <option>Order Type</option>
        </select>
        <select className="border px-3 py-1.5 rounded text-gray-600">
          <option>Order Status</option>
        </select>
        <button className="text-red-500 px-3 py-1.5 hover:underline">↻ Reset Filter</button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">TITLE</th>
              <th className="p-3 text-left">DUREE</th>
              <th className="p-3 text-left">Place</th>
              <th className="p-3 text-left">ANIMATEUR</th>
              <th className="p-3 text-left">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {formations.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.titre}</td>
                <td className="p-3">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="p-3">Rabat</td> {/* Static or update from data if available */}
                <td className="p-3">{item.animateur?.utilisateur?.nom || 'N/A'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[item.statut] || 'bg-gray-100 text-gray-600'}`}>
                    {item.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center mt-4 space-x-2">
        <button className="px-3 py-1 border rounded hover:bg-gray-100">&lt;</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100">&gt;</button>
      </div>
    </div>
  );
}
