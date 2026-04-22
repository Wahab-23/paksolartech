import db from '@/app/lib/db';
import { unstable_cache, revalidateTag } from 'next/cache';

export async function createBlog(data) {
    const slug = data.slug || data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const [result] = await db.query(
        'INSERT INTO blogs (title, slug, excerpt, content, cover_image, is_published, is_featured, author, tags, meta_title, meta_description, meta_keywords, reading_time, published_at, faqs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            data.title, 
            slug, 
            data.excerpt || null, 
            data.content, 
            data.cover_image || null, 
            data.is_published ?? true, 
            data.is_featured ?? false,
            data.author || null,
            data.tags ? (typeof data.tags === 'string' ? data.tags : JSON.stringify(data.tags)) : null,
            data.meta_title || null,
            data.meta_description || null,
            data.meta_keywords || null,
            data.reading_time || 0,
            data.published_at || null,
            data.faqs ? JSON.stringify(data.faqs) : null
        ]
    );
    
    revalidateTag('blogs');

    return result.insertId;
}

export const getAllBlogs = unstable_cache(
    async ({ publishedOnly = false } = {}) => {
        const query = publishedOnly
            ? 'SELECT id, title, slug, excerpt, cover_image, is_published, is_featured, author, tags, created_at, updated_at, published_at FROM blogs WHERE is_published = TRUE ORDER BY COALESCE(published_at, created_at) DESC'
            : 'SELECT id, title, slug, excerpt, cover_image, is_published, is_featured, author, tags, created_at, updated_at, published_at FROM blogs ORDER BY COALESCE(published_at, created_at) DESC';
        const [rows] = await db.query(query);
        return rows.map(row => ({
            ...row,
            tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || [])
        }));
    },
    ['all-blogs'],
    { tags: ['blogs'] }
);

export const getBlogBySlug = unstable_cache(
    async (slug) => {
        const [rows] = await db.query('SELECT * FROM blogs WHERE slug = ?', [slug]);
        if (!rows[0]) return null;
        const blog = rows[0];
        if (typeof blog.tags === 'string') blog.tags = JSON.parse(blog.tags);
        if (typeof blog.faqs === 'string') blog.faqs = JSON.parse(blog.faqs);
        return blog;
    },
    ['blog-slug'],
    { tags: ['blogs'] }
);

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

    const fields = [
        'title', 'slug', 'excerpt', 'content', 'cover_image', 
        'is_published', 'is_featured', 'author', 'meta_title', 
        'meta_description', 'meta_keywords', 'reading_time', 'published_at'
    ];

    fields.forEach(field => {
        if (data[field] !== undefined) {
            updates.push(`${field} = ?`);
            values.push(data[field]);
        }
    });

    if (data.tags !== undefined) {
        updates.push('tags = ?');
        values.push(typeof data.tags === 'string' ? data.tags : JSON.stringify(data.tags));
    }

    if (data.faqs !== undefined) {
        updates.push('faqs = ?');
        values.push(data.faqs ? JSON.stringify(data.faqs) : null);
    }

    if (updates.length === 0) return;

    values.push(id);
    await db.query(`UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`, values);
    revalidateTag('blogs');

}

export async function deleteBlog(id) {
    await db.query('DELETE FROM blogs WHERE id = ?', [id]);
    revalidateTag('blogs');

}

export async function getBlogStats() {
    const [rows] = await db.query(
        'SELECT COUNT(*) as total, SUM(CASE WHEN is_published = TRUE THEN 1 ELSE 0 END) as published FROM blogs'
    );
    return rows[0];
}


