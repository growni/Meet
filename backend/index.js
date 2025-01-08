const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/UserRoutes');
const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());
app.use('/api', userRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Meet', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Test route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
