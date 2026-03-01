import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

async function init() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true,
    });

    try {
        console.log('--- Initializing Marketplace Foundation ---');

        // 1. Apply Schema (Core Tables)
        console.log('Applying core schema...');
        const schemaPath = path.join(process.cwd(), 'schema.sql');
        let schemaSql = await fs.readFile(schemaPath, 'utf8');

        // Remove the ALTER TABLE lines from schemaSql to run them manually/safely
        const lines = schemaSql.split('\n');
        const filteredLines = lines.filter(line => !line.trim().startsWith('ALTER TABLE users ADD COLUMN'));
        schemaSql = filteredLines.join('\n');

        await pool.query(schemaSql);
        console.log('✓ Core tables verified');

        // 2. Specialized Migration for Users Table
        const columnsToAdd = [
            { name: 'password_hash', type: 'VARCHAR(255) AFTER email' },
            { name: 'role_id', type: 'INT AFTER password_hash' },
            { name: 'is_active', type: 'BOOLEAN DEFAULT TRUE AFTER role_id' },
            { name: 'created_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER is_active' },
            { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at' }
        ];

        for (const col of columnsToAdd) {
            try {
                await pool.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
                console.log(`✓ Added column: ${col.name}`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`! Column already exists: ${col.name}`);
                } else {
                    throw err;
                }
            }
        }

        // 3. Ensure Roles exist
        await pool.query('INSERT IGNORE INTO roles (id, name) VALUES (1, "super_admin"), (2, "admin"), (3, "vendor"), (4, "customer")');
        console.log('✓ Roles verified');

        // 4. Create Super Admin
        const email = process.env.SUPER_ADMIN_EMAIL || 'admin@paksolartech.com';
        const password = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123';

        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

        if (existing.length === 0) {
            const hash = await bcrypt.hash(password, 12);
            await pool.query(
                'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
                ['Super Admin', email, hash, 1]
            );
            console.log(`✓ Super Admin created: ${email}`);
        } else {
            console.log(`! Super Admin already exists: ${email}`);
        }

        console.log('--- Initialization Complete ---');
    } catch (error) {
        console.error('Error during initialization:', error);
    } finally {
        await pool.end();
    }
}

init();
