import db from '@/app/lib/db';

export async function createOffer(data) {
    const [result] = await db.query(
        'INSERT INTO offers (product_id, vendor_id, price, stock, expiry_date, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [data.product_id, data.vendor_id, data.price, data.stock || 0, data.expiry_date || null, data.is_active ?? true]
    );
    return result.insertId;
}

export async function getOffersByProductId(productId) {
    const [rows] = await db.query(`
    SELECT offers.*, vendors.business_name, vendors.logo_url 
    FROM offers 
    JOIN vendors ON offers.vendor_id = vendors.id 
    WHERE offers.product_id = ? AND offers.is_active = TRUE AND vendors.is_approved = TRUE
  `, [productId]);
    return rows;
}

export async function getOffersByVendorId(vendorId) {
    const [rows] = await db.query(`
    SELECT offers.*, products.name as product_name, products.image_url 
    FROM offers 
    JOIN products ON offers.product_id = products.id 
    WHERE offers.vendor_id = ?
  `, [vendorId]);
    return rows;
}

export async function updateOffer(id, data) {
    const updates = [];
    const values = [];

    if (data.price !== undefined) { updates.push('price = ?'); values.push(data.price); }
    if (data.stock !== undefined) { updates.push('stock = ?'); values.push(data.stock); }
    if (data.expiry_date !== undefined) { updates.push('expiry_date = ?'); values.push(data.expiry_date); }
    if (data.is_active !== undefined) { updates.push('is_active = ?'); values.push(data.is_active); }

    if (updates.length === 0) return;

    values.push(id);
    await db.query(`UPDATE offers SET ${updates.join(', ')} WHERE id = ?`, values);
}

export async function deleteOffer(id) {
    await db.query('DELETE FROM offers WHERE id = ?', [id]);
}
