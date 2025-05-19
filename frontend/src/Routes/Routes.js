import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../Components/Auth/Login';
import Dashboard from '../Components/Dashboard/dashboard';
import FormationsPage from '../Components/Dashboard/Formations_dashboard';
import AddFormationForm from '../Components/Dashboard/AddFormationForm';
import AnimateursDashboard from '../Components/Dashboard/AnimateurDashboard';
import ParticipantDashboard from '../Components/Dashboard/ParticipantDashboard';
import AddParticipantForm from '../Components/Dashboard/AddParticipantsForm';
import AddFormateurAnimateur from '../Components/Dashboard/AddFormateurAnimateur';
import CdcDashboard from '../Components/Dashboard/CdcDashboard';
import DrifDashboard from '../Components/Dashboard/DrifDashboard';
import AddCdcForm from '../Components/Dashboard/AddCdcForm';
import AddDrifForm from '../Components/Dashboard/AddDrifForm';
import Layout from '../Components/Dashboard/layout';
import CoursPage from '../Components/cours/CoursPage';
import AddCoursForm from '../Components/cours/AddCoursForm';
import RapportsDashboard from '../Components/rapport/RapportDashboard';
import ParticipDashboard from  '../Components/Dashboard/ParticipDashboard'
// import Unauthorized from '../Components/Auth/Unauthorized'; // Create this component
import AnimDashboard from '../Components/Dashboard/AnimDashboard'
import CoursList from '../Components/Dashboard/coursList'
import DrifFormation from '../Components/Dashboard/DrifFormation'
import PresenceList from '../Components/Dashboard/PresenceList'
import CourseCalendar from '../Components/Dashboard/CourseCalendar'
// Protected Route Wrapper
const ProtectedRoute = ({ roles, children }) => {
  const { user, role } = useSelector((state) => state.auth);
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
//   if (!roles.includes(role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }
  
  return children ? children : <Outlet />;
};

function Routers() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

                {/* Protected Routes with Layout */}
                <Route element={<Layout />}>
                    {/* Common routes for all authenticated users */}
                    <Route element={<ProtectedRoute roles={['admin', 'responsable_drif', 'responsable_cdc', 'formateur_animateur', 'formateur_participant']} />}>
                        <Route path="dashboard" element={<Dashboard />} />
                    </Route>

                    {/* Admin only routes */}
                    <Route element={<ProtectedRoute roles={['admin']} />}>
                        <Route path="cdc" element={<CdcDashboard />} />
                        <Route path="ajoutercdc" element={<AddCdcForm />} />
                        <Route path="drif" element={<DrifDashboard />} />
                        <Route path="add-drif" element={<AddDrifForm />} />
                    </Route>

                    {/* Responsable DRIF/CDC routes */}
                    <Route element={<ProtectedRoute roles={['responsable_drif', 'responsable_cdc']} />}>
                        <Route path="formations" element={<FormationsPage />} />
                        <Route path="ajouterformation" element={<AddFormationForm />} />
                        <Route path="animateurs" element={<AnimateursDashboard />} />
                        <Route path="formateurs" element={<ParticipantDashboard />} />
                        <Route path="ajouterparticipant" element={<AddParticipantForm />} />
                        <Route path="ajouteranimateur" element={<AddFormateurAnimateur />} />
                        <Route path="rapport" element={<RapportsDashboard />} />
                        <Route path="formation" element={<DrifFormation />} />
                        <Route path="cour" element={<CoursPage />} />
                    </Route>

                    {/* Formateur Animateur routes */}
                    <Route element={<ProtectedRoute roles={['formateur_animateur']} />}>
                        <Route path="coursList" element={<CoursList />} />
                        <Route path="ajoutercour" element={<AddCoursForm />} />
                        <Route path="AnimDashboard" element={<AnimDashboard />} />
                        <Route path="formations/:id" element={<PresenceList />} />
                        <Route path="calendar" element={<CourseCalendar />} />
                    </Route>

                    {/* Formateur Participant routes */}
                    <Route element={<ProtectedRoute roles={['formateur_participant']} />}>
                        <Route path="participantdashboard" element={<ParticipDashboard />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default Routers;