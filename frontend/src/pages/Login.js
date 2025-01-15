import React, { useState, useEffect } from 'react'; // Added useEffect here
import axios from 'axios';
import { useNavigate } from 'react-router';
import { jwtDecode } from "jwt-decode";

const Login = ({ setCurrentUser }) => {
    
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    navigate('/matching'); // Redirect if token is valid
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token'); // Clear invalid token
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', formData);
            localStorage.setItem('token', response.data.token); // Save token
            setCurrentUser(response.data.user);
            navigate('/matching'); // Redirect to matching page
        } catch (error) {
            setMessage(
                error.response?.data?.message || 'Error: Unable to log in. Please try again.'
            );
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
