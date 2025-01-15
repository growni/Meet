import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './pages/Register'
import Login from './pages/Login';
import Matching from './pages/Matching';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import {jwtDecode} from 'jwt-decode';

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decode the token and set the current user
            const decoded = jwtDecode(token);
            setCurrentUser(decoded.user);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                <Route
                    path="/matching"
                    element={<Matching userData={currentUser} setCurrentUser={setCurrentUser} />}
                />
                {/* Add other routes here */}
            </Routes>
        </Router>
    );
}

export default App;
