const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { verifyToken, isPastor, isAdmin } = require('../middleware/auth');

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password required' });
        }
        
        const result = await pool.query(
            'SELECT * FROM admin_users WHERE username = $1 AND is_active = true',
            [username]
        );
        
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        // Update last login
        await pool.query(
            'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );
        
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'church_secret_key',
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                full_name: user.full_name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, role, full_name, email FROM admin_users WHERE id = $1',
            [req.user.id]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// SERMONS - Admin routes
// ============================================
router.get('/sermons', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sermons ORDER BY sermon_date DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/sermons', verifyToken, isPastor, async (req, res) => {
    try {
        const { title, speaker, scripture, description, sermon_date, video_url } = req.body;
        const result = await pool.query(
            'INSERT INTO sermons (title, speaker, scripture, description, sermon_date, video_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, speaker, scripture, description, sermon_date, video_url]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating sermon:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/sermons/:id', verifyToken, isPastor, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, speaker, scripture, description, sermon_date, video_url } = req.body;
        const result = await pool.query(
            'UPDATE sermons SET title = $1, speaker = $2, scripture = $3, description = $4, sermon_date = $5, video_url = $6 WHERE id = $7 RETURNING *',
            [title, speaker, scripture, description, sermon_date, video_url, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Sermon not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating sermon:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/sermons/:id', verifyToken, isPastor, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM sermons WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Sermon not found' });
        }
        res.json({ success: true, message: 'Sermon deleted successfully' });
    } catch (error) {
        console.error('Error deleting sermon:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// EVENTS - Admin routes
// ============================================
router.get('/events', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events ORDER BY event_date ASC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/events', verifyToken, isPastor, async (req, res) => {
    try {
        const { title, description, event_date, event_time, location, type } = req.body;
        const result = await pool.query(
            'INSERT INTO events (title, description, event_date, event_time, location, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, event_date, event_time, location, type]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/events/:id', verifyToken, isPastor, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, event_date, event_time, location, type } = req.body;
        const result = await pool.query(
            'UPDATE events SET title = $1, description = $2, event_date = $3, event_time = $4, location = $5, type = $6 WHERE id = $7 RETURNING *',
            [title, description, event_date, event_time, location, type, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/events/:id', verifyToken, isPastor, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// PRAYER REQUESTS - Admin routes
// ============================================
router.get('/prayer-requests', verifyToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM prayer_requests ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/prayer-requests/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await pool.query(
            'UPDATE prayer_requests SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Prayer request not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating prayer request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/prayer-requests/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM prayer_requests WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Prayer request not found' });
        }
        res.json({ success: true, message: 'Prayer request deleted successfully' });
    } catch (error) {
        console.error('Error deleting prayer request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// LEADERSHIP - Admin routes
// ============================================
router.get('/leadership', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM leadership ORDER BY display_order ASC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/leadership', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, role, image_url, is_highlight, display_order } = req.body;
        const result = await pool.query(
            'INSERT INTO leadership (name, role, image_url, is_highlight, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, role, image_url, is_highlight || false, display_order || 0]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating leadership member:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/leadership/:id', verifyToken, isAdmin, async (req, res) => {
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

router.delete('/leadership/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM leadership WHERE id = $1 RETURNING *', [id]);
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