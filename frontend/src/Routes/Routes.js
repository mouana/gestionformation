import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from '../Components/Login'

function Routers() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </>
    )
}

export default Routers
