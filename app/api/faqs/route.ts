import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import db from '@/app/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(req: NextRequest) {
    try {
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM faqs ORDER BY display_order ASC, id ASC');
        return NextResponse.json(rows, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { question, answer, category, display_order, is_active } = body;

        const [result] = await db.execute<ResultSetHeader>(
            'INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
            [question, answer, category || 'General', display_order || 0, is_active ?? true]
        );

        revalidateTag('faqs', 'max');

        return NextResponse.json({ id: result.insertId, message: 'FAQ created successfully' }, { status: 201 });


    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to create FAQ' }, { status: 500 });
    }
}
