const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all leadership members
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM leadership ORDER BY display_order ASC, id ASC'
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching leadership:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single leadership member by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM leadership WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Leadership member not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching leadership member:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add new leadership member (admin only)
router.post('/', async (req, res) => {
    try {
        const { name, role, image_url, is_highlight, display_order } = req.body;
        const result = await pool.query(
            'INSERT INTO leadership (name, role, image_url, is_highlight, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, role, image_url, is_highlight || false, display_order || 0]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error adding leadership member:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update leadership member (admin only)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, image_url, is_highlight, display_order } = req.body;
        const result = await pool.query(
            'UPDATE leadership SET name = $1, role = $2, image_url = $3, is_highlight = $4, display_order = $5 WHERE id = $6 RETURNING *',
            [name, role, image_url, is_highlight, display_order, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Leadership member not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating leadership member:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete leadership member (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM leadership WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Leadership member not found' });
        }
        res.json({ success: true, message: 'Leadership member deleted successfully' });
    } catch (error) {
        console.error('Error deleting leadership member:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;