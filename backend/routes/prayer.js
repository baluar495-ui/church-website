const express = require('express');
const router = express.Router();
const PrayerRequest = require('../models/prayerModel');

router.post('/', async (req, res) => {
    try {
        const { name, email, request, is_public } = req.body;
        if (!request) return res.status(400).json({ success: false, error: 'Prayer request is required' });
        
        const prayer = await PrayerRequest.create({ name, email, request, is_public });
        res.json({ success: true, message: 'Prayer request submitted', data: prayer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/public', async (req, res) => {
    try {
        const prayers = await PrayerRequest.getPublic();
        res.json({ success: true, data: prayers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;