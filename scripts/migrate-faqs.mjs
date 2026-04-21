import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    console.log('Connected to database.');

    try {
        console.log('Adding faqs column to services table...');
        await connection.query('ALTER TABLE services ADD COLUMN faqs JSON DEFAULT NULL');
        console.log('Success.');
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column faqs already exists in services table.');
        } else {
            console.error('Error adding column to services:', err.message);
        }
    }

    try {
        console.log('Adding faqs column to blogs table...');
        await connection.query('ALTER TABLE blogs ADD COLUMN faqs JSON DEFAULT NULL');
        console.log('Success.');
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column faqs already exists in blogs table.');
        } else {
            console.error('Error adding column to blogs:', err.message);
        }
    }

    await connection.end();
    console.log('Migration completed.');
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
