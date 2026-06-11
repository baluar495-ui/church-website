const pool = require('../config/db');

class Sermon {
    static async getAll() {
        const result = await pool.query('SELECT * FROM sermons ORDER BY sermon_date DESC');
        return result.rows;
    }
    
    static async getById(id) {
        const result = await pool.query('SELECT * FROM sermons WHERE id = $1', [id]);
        return result.rows[0];
    }
    
    static async create(data) {
        const { title, speaker, scripture, video_url, audio_url, description, sermon_date } = data;
        const result = await pool.query(
            'INSERT INTO sermons (title, speaker, scripture, video_url, audio_url, description, sermon_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, speaker, scripture, video_url, audio_url, description, sermon_date]
        );
        return result.rows[0];
    }
}

module.exports = Sermon;