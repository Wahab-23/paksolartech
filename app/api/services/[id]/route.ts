import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import db from '@/app/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

type Props = {
    params: Promise<{ id: string }>;
};

// GET single service
export async function GET(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM services WHERE id = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        const row = rows[0];
        return NextResponse.json({
            ...row,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
            benefits: typeof row.benefits === 'string' ? JSON.parse(row.benefits) : (row.benefits || []),
            process: typeof row.process === 'string' ? JSON.parse(row.process) : (row.process || []),
            faqs: typeof row.faqs === 'string' ? JSON.parse(row.faqs) : (row.faqs || []),
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
    }
}

// PUT update service
export async function PUT(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const body = await req.json();
        const {
            title, slug, short_desc, long_desc, icon, image_url,
            features, benefits, process, faqs, is_active,
            meta_title, meta_description, meta_keywords
        } = body;

        await db.execute(
            `UPDATE services SET 
                title = ?, 
                slug = ?, 
                short_desc = ?, 
                long_desc = ?, 
                icon = ?, 
                image_url = ?, 
                features = ?, 
                benefits = ?, 
                process = ?, 
                faqs = ?,
                is_active = ?,
                meta_title = ?,
                meta_description = ?,
                meta_keywords = ?
            WHERE id = ?`,
            [
                title,
                slug,
                short_desc,
                long_desc,
                icon,
                image_url,
                JSON.stringify(features || []),
                JSON.stringify(benefits || []),
                JSON.stringify(process || []),
                JSON.stringify(faqs || []),
                is_active,
                meta_title || null,
                meta_description || null,
                meta_keywords || null,
                id
            ]
        );

        revalidateTag('services', 'max');

        return NextResponse.json({ message: 'Service updated successfully' }, { status: 200 });


    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to update service' }, { status: 500 });
    }
}


// DELETE service
export async function DELETE(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        await db.execute('DELETE FROM services WHERE id = ?', [id]);
        revalidateTag('services', 'max');

        return NextResponse.json({ message: 'Service deleted successfully' }, { status: 200 });


    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
