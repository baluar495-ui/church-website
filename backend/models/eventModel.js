const pool = require('../config/db');

class Event {
    static async getAll() {
        const result = await pool.query('SELECT * FROM events ORDER BY event_date ASC');
        return result.rows;
    }
    
    static async getUpcoming() {
        const result = await pool.query('SELECT * FROM events WHERE event_date >= CURRENT_DATE ORDER BY event_date ASC LIMIT 5');
        return result.rows;
    }
    
    static async create(data) {
        const { title, description, event_date, event_time, location, max_attendees } = data;
        const result = await pool.query(
            'INSERT INTO events (title, description, event_date, event_time, location, max_attendees) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, event_date, event_time, location, max_attendees]
        );
        return result.rows[0];
    }
}

module.exports = Event;