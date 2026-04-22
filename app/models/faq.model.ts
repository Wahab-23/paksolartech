import db from '@/app/lib/db';
import { RowDataPacket } from 'mysql2';
import { unstable_cache } from 'next/cache';

export interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
    display_order: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export const getAllFAQs = unstable_cache(
    async (): Promise<FAQ[]> => {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM faqs WHERE is_active = TRUE ORDER BY display_order ASC, id ASC'
        );
        return rows as FAQ[];
    },
    ['all-faqs'],
    { tags: ['faqs'] }
);

export const getFAQsByCategory = unstable_cache(
    async (category: string): Promise<FAQ[]> => {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM faqs WHERE category = ? AND is_active = TRUE ORDER BY display_order ASC, id ASC',
            [category]
        );
        return rows as FAQ[];
    },
    ['faqs-category'],
    { tags: ['faqs'] }
);

