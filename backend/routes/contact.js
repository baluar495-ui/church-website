const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Submit contact message
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Tous les champs sont requis' 
            });
        }

        const result = await pool.query(
            'INSERT INTO contacts (name, email, subject, message, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, subject, message, 'pending']
        );

        res.json({ 
            success: true, 
            message: 'Message envoyé avec succès !',
            data: result.rows[0] 
        });
    } catch (error) {
        console.error('Error submitting contact message:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;