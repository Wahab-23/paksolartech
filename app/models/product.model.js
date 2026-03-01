import db from '@/app/lib/db';

export async function createProduct(data) {
    const slug = data.slug || data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const [result] = await db.query(
        'INSERT INTO products (name, slug, description, category_id, image_url, status) VALUES (?, ?, ?, ?, ?, ?)',
        [data.name, slug, data.description || null, data.category_id || null, data.image_url || null, data.status || 'active']
    );
    return result.insertId;
}

export async function getAllProducts({ activeOnly = false } = {}) {
    const query = activeOnly
        ? 'SELECT * FROM products WHERE status = "active"'
        : 'SELECT * FROM products';
    const [rows] = await db.query(query);
    return rows;
}

export async function getProductById(id) {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
}

export async function updateProduct(id, data) {
    const updates = [];
    const values = [];

    if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
    if (data.slug !== undefined) { updates.push('slug = ?'); values.push(data.slug); }
    if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
    if (data.category_id !== undefined) { updates.push('category_id = ?'); values.push(data.category_id); }
    if (data.status !== undefined) { updates.push('status = ?'); values.push(data.status); }

    if (updates.length === 0) return;

    values.push(id);
    await db.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);
}

export async function deleteProduct(id) {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
}

// Categories
export async function createCategory(name, slug) {
    const [result] = await db.query('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
    return result.insertId;
}

export async function getAllCategories() {
    const [rows] = await db.query('SELECT * FROM categories');
    return rows;
}
