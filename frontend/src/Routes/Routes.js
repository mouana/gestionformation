import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../Components/Auth/Login';
import FormationForm from '../Components/formation/FormationForm';

import FormationList from '../Components/formation/FormationList';
import Dashboard from '../Components/Dashboard/dashboard';
import FormationsPage from '../Components/Dashboard/Formations_dashboard';
import AddFormationForm from '../Components/Dashboard/AddFormationForm';
import AnimateursDashboard from '../Components/Dashboard/AnimateurDashboard';
import ParticipantDashboard from '../Components/Dashboard/ParticipantDashboard';
import Layout from '../Components/Dashboard/layout'

import CoursPage from '../Components/cours/CoursPage';
import AddCoursForm from '../Components/cours/AddCoursForm';
import DrifDashboard from '../Components/Dashboard/DrifDashboard ';
import RapportsDashboard from '../Components/rapport/RapportDashboard';
import AjouterRapport from '../Components/rapport/AjouterRapport.jsx';


function Routers() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                {/* Protected Routes with Layout */}
                <Route path="/" element={<Layout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="formations" element={<FormationsPage />} />
                    <Route path="ajouterformation" element={<AddFormationForm />} />
                    <Route path="animateurs" element={<AnimateursDashboard />} />
                    <Route path="formateurs" element={<ParticipantDashboard />} />
                    <Route path="cours" element={<CoursPage/>} />
                    <Route path="ajoutercour" element={<AddCoursForm/>} />
                     <Route path="drif" element={<DrifDashboard />} />
                     <Route path="rapport" element={<RapportsDashboard />} />
                     <Route path="ajouterrapport" element={<AjouterRapport />} />
                
                </Route>
            </Routes>
        </Router>
    );
}

export default Routers;
