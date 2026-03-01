import db from '@/app/lib/db';

export async function createVendor(data) {
    const [result] = await db.query(
        'INSERT INTO vendors (user_id, business_name, description, logo_url, commission_rate) VALUES (?, ?, ?, ?, ?)',
        [data.user_id, data.business_name, data.description || null, data.logo_url || null, data.commission_rate || 10.00]
    );
    return result.insertId;
}

export async function getAllVendors({ approvedOnly = false } = {}) {
    const query = approvedOnly
        ? 'SELECT vendors.*, users.name, users.email FROM vendors JOIN users ON vendors.user_id = users.id WHERE vendors.is_approved = TRUE'
        : 'SELECT vendors.*, users.name, users.email FROM vendors JOIN users ON vendors.user_id = users.id';
    const [rows] = await db.query(query);
    return rows;
}

export async function getVendorById(id) {
    const [rows] = await db.query(`
    SELECT vendors.*, users.name, users.email 
    FROM vendors 
    JOIN users ON vendors.user_id = users.id 
    WHERE vendors.id = ?
  `, [id]);
    return rows[0];
}

export async function getVendorByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM vendors WHERE user_id = ?', [userId]);
    return rows[0];
}

export async function approveVendor(id) {
    await db.query('UPDATE vendors SET is_approved = TRUE WHERE id = ?', [id]);
}

export async function updateVendor(id, data) {
    const updates = [];
    const values = [];

    if (data.business_name !== undefined) { updates.push('business_name = ?'); values.push(data.business_name); }
    if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
    if (data.commission_rate !== undefined) { updates.push('commission_rate = ?'); values.push(data.commission_rate); }
    if (data.is_approved !== undefined) { updates.push('is_approved = ?'); values.push(data.is_approved); }

    if (updates.length === 0) return;

    values.push(id);
    await db.query(`UPDATE vendors SET ${updates.join(', ')} WHERE id = ?`, values);
}

export async function deleteVendor(id) {
    await db.query('DELETE FROM vendors WHERE id = ?', [id]);
}
