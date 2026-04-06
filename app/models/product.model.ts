import db from '@/app/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface Product extends RowDataPacket {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    short_desc: string | null;
    category_id: number | null;
    image_url: string | null;
    images: any;
    status: 'active' | 'inactive';
    badge: string | null;
    price_from: number;
    price_to: number | null;
    is_featured: boolean;
    wattage: number | null;
    brand: string | null;
    specs: any;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    created_at: Date;
}

export interface Category extends RowDataPacket {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
}

export async function createProduct(data: any): Promise<number> {
    const slug = data.slug || data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO products (
            name, slug, description, short_desc, category_id, image_url, images,
            status, badge, price_from, price_to, is_featured, wattage, 
            brand, specs, meta_title, meta_description, meta_keywords
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.name, slug, data.description || null, data.short_desc || null, 
            data.category_id || null, data.image_url || null, 
            data.images ? JSON.stringify(data.images) : null,
            data.status || 'active',
            data.badge || null, data.price_from || 0, data.price_to || null,
            data.is_featured ? 1 : 0, data.wattage || null, data.brand || null,
            data.specs ? JSON.stringify(data.specs) : null,
            data.meta_title || null, data.meta_description || null, data.meta_keywords || null
        ]
    );
    return result.insertId;
}

export async function getAllProducts({ activeOnly = false } = {}): Promise<Product[]> {
    const query = activeOnly
        ? 'SELECT * FROM products WHERE status = "active"'
        : 'SELECT * FROM products';
    const [rows] = await db.query<Product[]>(query);
    return rows;
}

export async function getProductById(id: number | string): Promise<Product | null> {
    const [rows] = await db.query<Product[]>('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const [rows] = await db.query<Product[]>('SELECT * FROM products WHERE slug = ?', [slug]);
    return rows[0] || null;
}

export async function updateProduct(id: number | string, data: any): Promise<void> {
    const updates: string[] = [];
    const values: any[] = [];

    const fields = ['name', 'slug', 'description', 'short_desc', 'category_id', 'image_url', 'status', 'badge', 'price_from', 'price_to', 'is_featured', 'wattage', 'brand', 'meta_title', 'meta_description', 'meta_keywords'];

    fields.forEach(f => {
        if (data[f] !== undefined) {
             updates.push(`${f} = ?`);
             values.push(data[f]);
        }
    });

    if (data.specs !== undefined) {
        updates.push('specs = ?');
        values.push(typeof data.specs === 'string' ? data.specs : JSON.stringify(data.specs));
    }

    if (data.images !== undefined) {
        updates.push('images = ?');
        values.push(typeof data.images === 'string' ? data.images : JSON.stringify(data.images));
    }

    if (updates.length === 0) return;

    values.push(id);
    await db.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);
}

export async function deleteProduct(id: number | string): Promise<void> {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
}

// Categories
export async function createCategory(data: any): Promise<number> {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const [result] = await db.query<ResultSetHeader>(
        'INSERT INTO categories (name, slug, description, icon, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [data.name, slug, data.description || null, data.icon || null, data.meta_title || null, data.meta_description || null, data.meta_keywords || null]
    );
    return result.insertId;
}

export async function updateCategory(id: number | string, data: any): Promise<void> {
    const updates: string[] = [];
    const values: any[] = [];
    const fields = ['name', 'slug', 'description', 'icon', 'meta_title', 'meta_description', 'meta_keywords'];
    
    fields.forEach(f => {
        if (data[f] !== undefined) {
            updates.push(`${f} = ?`);
            values.push(data[f]);
        }
    });

    if (updates.length === 0) return;
    values.push(id);
    await db.query(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, values);
}

export async function getAllCategories(): Promise<Category[]> {
    const [rows] = await db.query<Category[]>('SELECT * FROM categories');
    return rows;
}

export async function getCategoryById(id: number | string): Promise<Category | null> {
    const [rows] = await db.query<Category[]>('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const [rows] = await db.query<Category[]>('SELECT * FROM categories WHERE slug = ?', [slug]);
    return rows[0] || null;
}

export async function deleteCategory(id: number | string): Promise<void> {
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
}
