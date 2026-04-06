import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    console.log('Connected to database.');

    const name = 'Admin User';
    const email = 'admin@paksolartech.com';
    const password = 'Admin@123';
    const role_id = 1; // super_admin

    const hash = await bcrypt.hash(password, 12);

    try {
        // Check if user exists
        const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            console.log('User already exists. Updating password...');
            await connection.execute(
                'UPDATE users SET name = ?, password_hash = ?, role_id = ?, is_active = TRUE WHERE email = ?',
                [name, hash, role_id, email]
            );
        } else {
            console.log('Creating new admin user...');
            await connection.execute(
                'INSERT INTO users (name, email, password_hash, role_id, is_active) VALUES (?, ?, ?, ?, TRUE)',
                [name, email, hash, role_id]
            );
        }
        console.log('Seed successful!');
        console.log('Email: ' + email);
        console.log('Password: ' + password);
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await connection.end();
    }
}

seed();
