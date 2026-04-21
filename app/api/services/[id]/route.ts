import { NextRequest, NextResponse } from 'next/server';
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
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
    }
}

// PUT update service
export async function PUT(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, slug, short_desc, long_desc, icon, image_url, features, benefits, process, is_active } = body;

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
                is_active = ? 
            WHERE id = ?`,
            [
                title, 
                slug, 
                short_desc, 
                long_desc, 
                icon, 
                image_url, 
                JSON.stringify(features), 
                JSON.stringify(benefits), 
                JSON.stringify(process), 
                is_active, 
                id
            ]
        );

        return NextResponse.json({ message: 'Service updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to update service' }, { status: 500 });
    }
}

// DELETE service
export async function DELETE(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        await db.execute('DELETE FROM services WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Service deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
