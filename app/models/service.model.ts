import db from '@/app/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Service {
    id: number;
    title: string;
    slug: string;
    short_desc: string;
    long_desc: string;
    icon: string;
    image_url: string;
    features: string[];
    benefits: { title: string; desc: string; icon: string }[];
    process: { step: string; title: string; desc: string }[];
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export async function getAllServices(): Promise<Service[]> {
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM services WHERE is_active = TRUE ORDER BY id ASC'
    );
    return rows.map(row => ({
        ...row,
        features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
        benefits: typeof row.benefits === 'string' ? JSON.parse(row.benefits) : (row.benefits || []),
        process: typeof row.process === 'string' ? JSON.parse(row.process) : (row.process || []),
    })) as Service[];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM services WHERE slug = ? AND is_active = TRUE LIMIT 1',
        [slug]
    );
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
        ...row,
        features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
        benefits: typeof row.benefits === 'string' ? JSON.parse(row.benefits) : (row.benefits || []),
        process: typeof row.process === 'string' ? JSON.parse(row.process) : (row.process || []),
    } as Service;
}
