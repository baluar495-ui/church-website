const jwt = require('jsonwebtoken');

// Verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'church_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid token.' });
    }
};

// Check if user is a pastor
const isPastor = (req, res, next) => {
    if (req.user.role !== 'pastor' && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Access denied. Pastors only.' });
    }
    next();
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { verifyToken, isPastor, isAdmin };