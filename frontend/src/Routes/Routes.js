import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../Components/Auth/Login';
// import FormationForm from '../Components/formation/FormationForm';
// import CourForm from '../Components/formation/CourForm';
// import FormationList from '../Components/formation/FormationList';
import Dashboard from '../Components/Dashboard/dashboard';
import FormationsPage from '../Components/Dashboard/Formations_dashboard';
import AddFormationForm from '../Components/Dashboard/AddFormationForm';
import AnimateursDashboard from '../Components/Dashboard/AnimateurDashboard';
import ParticipantDashboard from '../Components/Dashboard/ParticipantDashboard';
import AddParticipantForm from '../Components/Dashboard/AddParticipantsForm';
import AddFormateurAnimateur from '../Components/Dashboard/AddFormateurAnimateur';
// import FilteredFormations from '../Components/Dashboard/FilteredFormations';
import CdcDashboard from '../Components/Dashboard/CdcDashboard';
import DrifDashboard from '../Components/Dashboard/DrifDashboard';
import AddCdcForm from '../Components/Dashboard/AddCdcForm';
import UpdateCdcForm from '../Components/Dashboard/UpdateCdcForm';
import AddDrifForm from '../Components/Dashboard/AddDrifForm';
import UpdateDrifForm from '../Components/Dashboard/UpdateDrifForm';
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
                    <Route path="ajouterparticipant" element={<AddParticipantForm />} />
                    <Route path="ajouteranimateur" element={<AddFormateurAnimateur />} />
                    {/* <Route path="filteredformation" element={<FilteredFormations />} /> */}
                    <Route path="cdc" element={<CdcDashboard />} />
                    <Route path="add-cdc" element={<AddCdcForm />} />
                    <Route path="update-cdc/:id" element={<UpdateCdcForm />} />
                    <Route path="drif" element={<DrifDashboard />} />
                    <Route path="add-drif" element={<AddDrifForm />} />
                    <Route path="update-drif/:id" element={<UpdateDrifForm />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default Routers;

