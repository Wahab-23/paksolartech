import db from '@/app/lib/db';

export async function createInquiry(data) {
    const [result] = await db.query(
        'INSERT INTO inquiries (name, email, phone, message) VALUES (?, ?, ?, ?)',
        [data.name, data.email, data.phone || null, data.message]
    );
    return result.insertId;
}

export async function getAllInquiries() {
    const [rows] = await db.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    return rows;
}

export async function getInquiryById(id) {
    const [rows] = await db.query('SELECT * FROM inquiries WHERE id = ?', [id]);
    return rows[0];
}

export async function markInquiryRead(id) {
    await db.query('UPDATE inquiries SET is_read = TRUE WHERE id = ?', [id]);
}

export async function deleteInquiry(id) {
    await db.query('DELETE FROM inquiries WHERE id = ?', [id]);
}

export async function getInquiryStats() {
    const [rows] = await db.query(
        'SELECT COUNT(*) as total, SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) as unread FROM inquiries'
    );
    return rows[0];
}
