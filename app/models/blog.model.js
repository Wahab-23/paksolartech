import db from '@/app/lib/db';

export async function createBlog(data) {
    const slug = data.slug || data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const [result] = await db.query(
        'INSERT INTO blogs (title, slug, excerpt, content, cover_image, is_published, faqs) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [data.title, slug, data.excerpt || null, data.content, data.cover_image || null, data.is_published ?? true, data.faqs ? JSON.stringify(data.faqs) : null]
    );
    return result.insertId;
}

export async function getAllBlogs({ publishedOnly = false } = {}) {
    const query = publishedOnly
        ? 'SELECT id, title, slug, excerpt, cover_image, is_published, created_at, updated_at FROM blogs WHERE is_published = TRUE ORDER BY created_at DESC'
        : 'SELECT id, title, slug, excerpt, cover_image, is_published, created_at, updated_at FROM blogs ORDER BY created_at DESC';
    const [rows] = await db.query(query);
    return rows;
}
export async function getBlogBySlug(slug) {
    const [rows] = await db.query('SELECT * FROM blogs WHERE slug = ?', [slug]);
    if (!rows[0]) return null;
    const blog = rows[0];
    if (typeof blog.tags === 'string') blog.tags = JSON.parse(blog.tags);
    if (typeof blog.faqs === 'string') blog.faqs = JSON.parse(blog.faqs);
    return blog;
}

export async function getBlogById(id) {
    const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (!rows[0]) return null;
    const blog = rows[0];
    if (typeof blog.tags === 'string') blog.tags = JSON.parse(blog.tags);
    if (typeof blog.faqs === 'string') blog.faqs = JSON.parse(blog.faqs);
    return blog;
}

export async function updateBlog(id, data) {
    const updates = [];
    const values = [];

    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.slug !== undefined) { updates.push('slug = ?'); values.push(data.slug); }
    if (data.excerpt !== undefined) { updates.push('excerpt = ?'); values.push(data.excerpt); }
    if (data.content !== undefined) { updates.push('content = ?'); values.push(data.content); }
    if (data.cover_image !== undefined) { updates.push('cover_image = ?'); values.push(data.cover_image); }
    if (data.is_published !== undefined) { updates.push('is_published = ?'); values.push(data.is_published); }
    if (data.faqs !== undefined) { updates.push('faqs = ?'); values.push(data.faqs ? JSON.stringify(data.faqs) : null); }

    if (updates.length === 0) return;

    values.push(id);
    await db.query(`UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`, values);
}

export async function deleteBlog(id) {
    await db.query('DELETE FROM blogs WHERE id = ?', [id]);
}

export async function getBlogStats() {
    const [rows] = await db.query(
        'SELECT COUNT(*) as total, SUM(CASE WHEN is_published = TRUE THEN 1 ELSE 0 END) as published FROM blogs'
    );
    return rows[0];
}
