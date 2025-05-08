import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../Components/Auth/Login';
import FormationForm from '../Components/formation/FormationForm';
import CourForm from '../Components/formation/CourForm';
import FormationList from '../Components/formation/FormationList';
import Dashboard from '../Components/Dashboard/dashboard';
import FormationsPage from '../Components/Dashboard/Formations_dashboard';
import AddFormationForm from '../Components/Dashboard/AddFormationForm';
import AnimateursDashboard from '../Components/Dashboard/AnimateurDashboard';
import ParticipantDashboard from '../Components/Dashboard/ParticipantDashboard';
import Layout from '../Components/Dashboard/layout'

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
                </Route>
            </Routes>
        </Router>
    );
}

export default Routers;
