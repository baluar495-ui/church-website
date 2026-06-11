const express = require('express');
const router = express.Router();
const Sermon = require('../models/sermonModel');

// GET all sermons
router.get('/', async (req, res) => {
    try {
        const sermons = await Sermon.getAll();
        res.json({ success: true, data: sermons });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single sermon
router.get('/:id', async (req, res) => {
    try {
        const sermon = await Sermon.getById(req.params.id);
        if (!sermon) return res.status(404).json({ success: false, error: 'Sermon not found' });
        res.json({ success: true, data: sermon });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST new sermon (for admin)
router.post('/', async (req, res) => {
    try {
        const sermon = await Sermon.create(req.body);
        res.status(201).json({ success: true, data: sermon });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;