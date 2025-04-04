import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from '../Components/Auth/Login'
import FormationForm from '../Components/formation/FormationForm'
import CourForm from '../Components/formation/CourForm'
import FormationList from '../Components/formation/FormationList'

function Routers() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/formationform" element={<FormationForm />} />
                    <Route path="/courform" element={<CourForm />} />
                    <Route path="/formationlist" element={<FormationList />} />
                </Routes>
            </Router>
        </>
    )
}

export default Routers
