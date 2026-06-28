const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'churchdb_utf8',
});

async function createAdminUsers() {
    try {
        // Check if admin_users table exists
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'admin_users'
            );
        `);
        
        if (!tableCheck.rows[0].exists) {
            console.log('❌ Table "admin_users" does not exist. Creating it...');
            await pool.query(`
                CREATE TABLE admin_users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    role VARCHAR(20) NOT NULL CHECK (role IN ('pastor', 'admin')),
                    full_name VARCHAR(100),
                    email VARCHAR(100),
                    is_active BOOLEAN DEFAULT true,
                    last_login TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('✅ Table created!');
        }

        // Delete existing users
        await pool.query('DELETE FROM admin_users');
        console.log('🗑️  Cleared existing admin users');

        // Hash passwords
        const pastorPassword = await bcrypt.hash('pastor123', 10);
        const adminPassword = await bcrypt.hash('admin123', 10);

        // Insert pastor user
        await pool.query(`
            INSERT INTO admin_users (username, password_hash, role, full_name, email, is_active) 
            VALUES ($1, $2, $3, $4, $5, $6)
        `, ['pastor', pastorPassword, 'pastor', 'Pasteur Principal', 'pasteur@cepacpenuel.org', true]);

        // Insert admin user
        await pool.query(`
            INSERT INTO admin_users (username, password_hash, role, full_name, email, is_active) 
            VALUES ($1, $2, $3, $4, $5, $6)
        `, ['admin', adminPassword, 'admin', 'Administrateur', 'admin@cepacpenuel.org', true]);

        console.log('✅ Admin users created successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   Pastor:  pastor / pastor123');
        console.log('   Admin:   admin / admin123');

        // Verify the users were created
        const result = await pool.query('SELECT id, username, role, full_name FROM admin_users');
        console.log('\n📊 Current admin users:');
        result.rows.forEach(row => {
            console.log(`  ${row.id}. ${row.username} (${row.role}) - ${row.full_name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdminUsers();