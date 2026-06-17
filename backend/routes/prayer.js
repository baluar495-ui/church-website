const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Submit prayer request
router.post('/', async (req, res) => {
    try {
        const { name, email, request, is_public } = req.body;
        
        if (!request) {
            return res.status(400).json({ success: false, error: 'La demande de prière est requise' });
        }

        // Check if status column exists
        let query = 'INSERT INTO prayer_requests (name, email, request, is_public) VALUES ($1, $2, $3, $4) RETURNING *';
        let params = [name || 'Anonyme', email || null, request, is_public !== false];
        
        try {
            const checkColumn = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'prayer_requests' AND column_name = 'status'
            `);
            
            if (checkColumn.rows.length > 0) {
                query = 'INSERT INTO prayer_requests (name, email, request, is_public, status) VALUES ($1, $2, $3, $4, $5) RETURNING *';
                params = [name || 'Anonyme', email || null, request, is_public !== false, 'pending'];
            }
        } catch (err) {
            console.log('Status column not found, using basic insert');
        }

        const result = await pool.query(query, params);

        res.json({ 
            success: true, 
            message: 'Demande de prière soumise avec succès',
            data: result.rows[0] 
        });
    } catch (error) {
        console.error('Error submitting prayer request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get public prayer requests
router.get('/public', async (req, res) => {
    try {
        // Check if status column exists
        let query = 'SELECT * FROM prayer_requests WHERE is_public = true ORDER BY created_at DESC LIMIT 50';
        
        try {
            const checkColumn = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'prayer_requests' AND column_name = 'status'
            `);
            
            if (checkColumn.rows.length > 0) {
                query = 'SELECT * FROM prayer_requests WHERE is_public = true AND status = $1 ORDER BY created_at DESC LIMIT 50';
                const result = await pool.query(query, ['approved']);
                return res.json({ success: true, data: result.rows });
            }
        } catch (err) {
            console.log('Status column not found, showing all public prayers');
        }
        
        const result = await pool.query(query);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching public prayers:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ADD THIS ROUTE - Increment prayer count
// ============================================
router.put('/:id/pray', async (req, res) => {
    try {
        const { id } = req.params;
        
        // First check if prayer_count column exists
        let query = 'UPDATE prayer_requests SET prayer_count = prayer_count + 1 WHERE id = $1 RETURNING *';
        
        try {
            const checkColumn = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'prayer_requests' AND column_name = 'prayer_count'
            `);
            
            if (checkColumn.rows.length === 0) {
                // If column doesn't exist, add it
                await pool.query('ALTER TABLE prayer_requests ADD COLUMN prayer_count INTEGER DEFAULT 0');
            }
        } catch (err) {
            console.log('Adding prayer_count column...');
            await pool.query('ALTER TABLE prayer_requests ADD COLUMN prayer_count INTEGER DEFAULT 0');
        }
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Demande de prière non trouvée' });
        }
        
        res.json({ 
            success: true, 
            message: 'Merci d\'avoir prié !', 
            data: result.rows[0] 
        });
    } catch (error) {
        console.error('Error updating prayer count:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;