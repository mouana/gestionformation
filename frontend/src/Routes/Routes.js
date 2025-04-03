import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from '../Components/Auth/Login'
import FormationForm from '../Components/formation/FormationForm'

function Routers() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/FormationForm" element={<FormationForm />} />
                </Routes>
            </Router>
        </>
    )
}

export default Routers
