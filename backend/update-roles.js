const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'churchdb_utf8',
});

async function insertLeadership() {
    try {
        // First, check if the table exists
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'leadership'
            );
        `);
        
        if (!tableCheck.rows[0].exists) {
            console.log('❌ Table "leadership" does not exist. Creating it...');
            await pool.query(`
                CREATE TABLE leadership (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(200) NOT NULL,
                    role VARCHAR(200),
                    image_url VARCHAR(500),
                    is_highlight BOOLEAN DEFAULT false,
                    display_order INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('✅ Table created!');
        }

        // Clear existing data
        await pool.query('TRUNCATE TABLE leadership RESTART IDENTITY');
        console.log('🗑️  Cleared existing leadership data');

        // Insert all leadership data with correct image URLs
        await pool.query(`
            INSERT INTO leadership (name, role, image_url, is_highlight, display_order) VALUES 
            ('Dr. Rév. Past. Batuvanwa Wilondja Imani Matabishi', 'Pasteur Principal', '/images/Lead pastor.jpg', true, 1),
            ('Pasteur Justin Muziko', 'Ancien - Comptable', '/images/Justin.jpg', false, 2),
            ('Pasteur Mwililikwa', 'Ancien - Cassier', '/images/Mwililikwa.jpg', false, 3),
            ('Pasteur Nguzo Philippe', 'Enseignement et vie de l''Église', '/images/Nguzo.jpg', false, 4),
            ('Pasteur Pierre Mukamba', 'Enseignement et vie de l''Église', '/images/Pastor Pierre.jpg', false, 5),
            ('Pasteur Ilundu Bulambo', 'Ancien - [Département]', '/images/Ilundu.jpg', false, 6),
            ('Pasteur Wasolu', 'Ancien - [Département]', '/images/Wasolu.jpg', false, 7),
            ('Pasteur Kalala', 'Ancien - [Département]', NULL, false, 8),
            ('Pasteur Bonheur', 'Comité de musique', '/images/Bonheur.jpg', false, 9)
        `);
        
        console.log('✅ Leadership data inserted successfully!');
        
        // Verify the data
        const result = await pool.query('SELECT * FROM leadership ORDER BY display_order');
        console.log('\n📊 Current leadership data:');
        result.rows.forEach(row => {
            console.log(`  ${row.display_order}. ${row.name} - ${row.role}${row.image_url ? ' (has image)' : ' (no image)'}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

insertLeadership();