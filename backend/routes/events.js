const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');

router.get('/', async (req, res) => {
    try {
        const events = await Event.getAll();
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/upcoming', async (req, res) => {
    try {
        const events = await Event.getUpcoming();
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;