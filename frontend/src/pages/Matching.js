import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router';

const socket = io('http://localhost:5000'); // Connect to backend

const Matching = ({ userData, setCurrentUser }) => {
    const [match, setMatch] = useState(null);
    const [status, setStatus] = useState('Idle');
    const navigate = useNavigate();

    const findMatch = () => {
        setStatus('Searching for a match...');
        socket.emit('findMatch', userData);

        // Listen for match event
        socket.on('matchFound', (matchedUser) => {
            setMatch(matchedUser);
            setStatus('Match found!');
        });
    };

    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');

        // Reset the currentUser state
        setCurrentUser(null);

        // Disconnect the socket connection
        socket.disconnect();

        // Redirect the user to the login page
        navigate('/login');
    };

    // Cleanup socket connection when the component is unmounted
    useEffect(() => {
        return () => {
            socket.disconnect(); // Disconnect the socket when leaving the page
        };
    }, []);

    return (
        <div>
            <h1>Find a Match</h1>
            {status === 'Idle' && <button onClick={findMatch}>Find a Match</button>}
            {status === 'Searching for a match...' && <p>{status}</p>}
            {match && (
                <div>
                    <h2>Match Found!</h2>
                    <p>Name: {match.name}</p>
                    <p>Hobbies: {match.hobbies.join(', ')}</p>
                    <p>Interests: {match.interests.join(', ')}</p>
                </div>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Matching;
