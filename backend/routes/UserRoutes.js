const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route: Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, age, gender, hobbies, country, interests } = req.body;

        // Validate the input
        if (!name || !age || !gender || !hobbies || !country || !interests) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create and save the user
        const newUser = new User({ name, age, gender, hobbies, country, interests });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
