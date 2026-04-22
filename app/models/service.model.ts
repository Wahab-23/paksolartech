import db from '@/app/lib/db';
import { RowDataPacket } from 'mysql2';
import { unstable_cache } from 'next/cache';

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
    faqs: { question: string; answer: string }[];
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export const getAllServices = unstable_cache(
    async (): Promise<Service[]> => {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM services WHERE is_active = TRUE ORDER BY id ASC'
        );
        return rows.map(row => ({
            ...row,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
            benefits: typeof row.benefits === 'string' ? JSON.parse(row.benefits) : (row.benefits || []),
            process: typeof row.process === 'string' ? JSON.parse(row.process) : (row.process || []),
            faqs: typeof row.faqs === 'string' ? JSON.parse(row.faqs) : (row.faqs || []),
        })) as Service[];
    },
    ['all-services'],
    { tags: ['services'] }
);

export const getServiceBySlug = unstable_cache(
    async (slug: string): Promise<Service | null> => {
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
            faqs: typeof row.faqs === 'string' ? JSON.parse(row.faqs) : (row.faqs || []),
        } as Service;
    },
    ['service-slug'],
    { tags: ['services'] }
);


