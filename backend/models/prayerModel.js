const pool = require('../config/db');

class PrayerRequest {
    static async create(data) {
        const { name, email, request, is_public } = data;
        const result = await pool.query(
            'INSERT INTO prayer_requests (name, email, request, is_public) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, request, is_public]
        );
        return result.rows[0];
    }
    
    static async getPublic() {
        const result = await pool.query('SELECT * FROM prayer_requests WHERE is_public = true AND status = \'approved\' ORDER BY created_at DESC LIMIT 20');
        return result.rows;
    }
}

module.exports = PrayerRequest;