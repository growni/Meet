const express = require('express');
const http = require('http');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();


// MongoDB User Schema
const User = require('./models/User'); // Assuming you have a User model defined

const app = express();
app.use(express.json()); // Parse JSON request bodies

// Enable CORS for frontend (http://localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from your frontend
    methods: ['GET', 'POST'],        // Allow only GET and POST methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

const server = http.createServer(app); // Create HTTP server to integrate with Socket.io
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow socket connections from the frontend
        methods: ['GET', 'POST'],
    },
});

const PORT = 5000;

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/Meet', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// In-memory queue for users in standby
let waitingUsers = [];

// Socket.io event handlers (findMatch, disconnect) as before...

// User authentication route (login)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password - NO USER' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            `${process.env.JWT_SECRET_KEY}`, // Secret key for signing the token
            { expiresIn: '1h' }    // Set token expiration (optional)
        );

        // Return the user object and the generated token
        res.json({
            user: { email: user.email, name: user.name }, // Return user info
            token,  // Send the JWT token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Example of a simple API endpoint for registration (optional, can be used to register users)
app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user and save to the database
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server and listen on PORT 5000
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
