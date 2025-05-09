import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFilter, FaUserPlus } from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const DrifDashboard = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch DRIF responsables
    axios.get('http://127.0.0.1:8000/api/responsable-drif', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching DRIF responsables:', error);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce responsable DRIF?')) {
      axios.delete(`http://127.0.0.1:8000/api/responsable-drif/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          setData(data.filter(item => item.id !== id));
        })
        .catch(error => {
          console.error('Error deleting DRIF responsable:', error);
        });
    }
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Responsables DRIF</h1>
          <Link to="/add-drif" className="bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
            <FaUserPlus /> Ajouter Responsable DRIF
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center border px-4 py-2 rounded bg-white gap-2">
            <FaFilter /> <span>Filtrer Par</span>
          </div>
          <select className="px-4 py-2 rounded border bg-white">
            <option>Nom</option>
          </select>
          <select className="px-4 py-2 rounded border bg-white">
            <option>Email</option>
          </select>
          <select className="px-4 py-2 rounded border bg-white">
            <option>Région</option>
          </select>
          <button className="text-red-500 font-medium">Réinitialiser Filtre</button>
        </div>

        <div className="overflow-auto bg-white rounded shadow mb-8">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Nom</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Région</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 text-sm">
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{item.nom}</td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">{item.region}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link to={`/update-drif/${item.id}`} className="text-blue-500 hover:text-blue-700">
                      Modifier
                    </Link>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        <div className="flex justify-end mt-4 gap-2">
          <button className="p-2 bg-white rounded border"><IoIosArrowBack /></button>
          <button className="p-2 bg-white rounded border"><IoIosArrowForward /></button>
        </div>
      </main>
    </div>
  );
};

export default DrifDashboard;
