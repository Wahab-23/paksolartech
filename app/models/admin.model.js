import db from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function createAdmin(data) {
    const hash = await bcrypt.hash(data.password, 12);
    const [result] = await db.query(
        'INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)',
        [data.email, hash, data.name]
    );
    return result.insertId;
}

export async function getAdminByEmail(email) {
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    return rows[0];
}

export async function verifyAdminPassword(email, password) {
    const admin = await getAdminByEmail(email);
    if (!admin) return null;

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) return null;

    // Return admin without password hash
    const { password_hash, ...safeAdmin } = admin;
    return safeAdmin;
}
