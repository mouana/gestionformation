import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFilter, FaUserPlus } from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import {Link} from 'react-router-dom'


const ParticipantDashboard = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/participant',{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const formattedData = response.data.map(item => ({
          id: item.utilisateur.matrecule,
          first: item.utilisateur.nom,
          email: item.utilisateur.email,
          region: item.region,
          ville:item.ville,
          ISTA:item.ISTA,
          role:item.role,
          filiere: 'DEV' 
        }));
        setData(formattedData);
      })
      .catch(error => {
        console.error('Error fetching animateurs:', error);
      });
  }, []);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Participants</h1>
          <Link to={'/ajouterparticipant'}><button className="bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
            <FaUserPlus /> Ajouter Participants
          </button></Link>
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center border px-4 py-2 rounded bg-white gap-2">
            <FaFilter /> <span>Filter By</span>
          </div>
          <select className="px-4 py-2 rounded border bg-white">
            <option>Name</option>
          </select>
          <select className="px-4 py-2 rounded border bg-white">
            <option>Email</option>
          </select>
          <select className="px-4 py-2 rounded border bg-white">
            <option>ISTA</option>
          </select>
          <button className="text-red-500 font-medium">Reset Filter</button>
        </div>

        <div className="overflow-auto bg-white rounded shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-3">Matrecule</th>
                <th className="px-6 py-3">Nom Complet</th>
                <th className="px-6 py-3">EMAIL</th>
                <th className="px-6 py-3">REGION</th>
                <th className="px-6 py-3">VILLE</th>
                <th className="px-6 py-3">ISTA</th>
                <th className="px-6 py-3">FILIERE</th>
                <th className="px-6 py-3">ROLE</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 text-sm">
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{item.first}</td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">{item.region}</td>
                  <td className="px-6 py-4">{item.ville}</td>
                  <td className="px-6 py-4">{item.ISTA}</td>
                  <td className="px-6 py-4">{item.filiere}</td>
                  <td className="px-6 py-4">{item.role}</td>
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

export default ParticipantDashboard;

