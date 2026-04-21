import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET all services
export async function GET() {
    try {
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM services ORDER BY id ASC');
        return NextResponse.json(rows.map(row => ({
            ...row,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
            benefits: typeof row.benefits === 'string' ? JSON.parse(row.benefits) : (row.benefits || []),
            process: typeof row.process === 'string' ? JSON.parse(row.process) : (row.process || []),
        })));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

// POST new service
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, slug, short_desc, long_desc, icon, image_url, features, benefits, process, is_active } = body;

        const [result] = await db.execute<ResultSetHeader>(
            'INSERT INTO services (title, slug, short_desc, long_desc, icon, image_url, features, benefits, process, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                title, 
                slug, 
                short_desc || '', 
                long_desc || '', 
                icon || 'Sun', 
                image_url || '', 
                JSON.stringify(features || []), 
                JSON.stringify(benefits || []), 
                JSON.stringify(process || []), 
                is_active ?? true
            ]
        );

        return NextResponse.json({ id: result.insertId, message: 'Service created successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to create service' }, { status: 500 });
    }
}
