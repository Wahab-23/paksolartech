import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

type Props = {
    params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM faqs WHERE id = ?', [id]);
        if (rows.length === 0) return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
        return NextResponse.json(rows[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch FAQ' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { question, answer, category, display_order, is_active } = body;

        await db.execute(
            'UPDATE faqs SET question = ?, answer = ?, category = ?, display_order = ?, is_active = ? WHERE id = ?',
            [question, answer, category, display_order, is_active, id]
        );

        return NextResponse.json({ message: 'FAQ updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to update FAQ' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        await db.execute('DELETE FROM faqs WHERE id = ?', [id]);
        return NextResponse.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
    }
}
