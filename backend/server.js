const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sermonRoutes = require('./routes/sermons');
const eventRoutes = require('./routes/events');
const prayerRoutes = require('./routes/prayer');
const contactRoutes = require('./routes/contact');
const leadershipRoutes = require('./routes/leadership');  // ← MOVED THIS HERE

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/sermons', sermonRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/prayer', prayerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/leadership', leadershipRoutes);  // ← ADD THIS ROUTE

// Home route
app.get('/', (req, res) => {
    res.json({ message: 'Church Website API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});