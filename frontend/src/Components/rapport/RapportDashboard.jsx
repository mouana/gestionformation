import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FileText } from 'lucide-react'; 
import { motion } from 'framer-motion';

const token = localStorage.getItem("token");

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
});

const RapportDocument = ({ rapport }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.header}>Rapport #{rapport.id}</Text>
      <View style={pdfStyles.section}>
        <Text>Contenu : {rapport.contenu}</Text>
        <Text>Date de création : {rapport.dateCreation}</Text>
        <Text>Note : {rapport.note ?? 'Non noté'}</Text>
        <Text>Cours : {rapport.cour?.titre || 'N/A'}</Text>
        <Text>Responsable : {rapport.responsable_formation?.nom || 'N/A'}</Text>
      </View>
    </Page>
  </Document>
);

const RapportsDashboard = () => {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/rapports', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setRapports(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des rapports:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-600">Chargement des rapports...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Bouton Ajouter */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mes Rapports</h1>


      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <Link
  to="/ajouterrapport"
  className="flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition"
>
  <div className="w-14 h-14 flex items-center justify-center border border-dashed border-gray-300 rounded-full mb-2 hover:bg-gray-100 transition">
    <span className="text-2xl font-bold">+</span>
  </div>
  <p className="text-sm text-center">
    Créer un nouveau rapport ici
  </p>
</Link>

        {rapports.map((rapport) => (
          <motion.div
            key={rapport.id}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center transition hover:shadow-xl"
            whileHover={{ scale: 1.03 }}
          >
            <div className="bg-orange-100 p-3 rounded-full mb-3">
              <FileText className="text-orange-500 w-6 h-6" />
            </div>
            <div className="text-sm font-medium text-center text-gray-800 mb-1">
              {rapport.contenu.slice(0, 30)}...
            </div>
            <div className="text-xs text-gray-500 mb-4">
              Cours : {rapport.cour?.titre || 'N/A'}
            </div>
            <PDFDownloadLink
              document={<RapportDocument rapport={rapport} />}
              fileName={`rapport_${rapport.id}.pdf`}
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm transition"
            >
              {({ loading }) => (loading ? 'Préparation...' : '📥 Télécharger')}
            </PDFDownloadLink>
            
          </motion.div>
        ))}
        
      </div>
    </div>
  );
};

export default RapportsDashboard;
