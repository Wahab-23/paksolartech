import { NextResponse } from 'next/server';
import { createInquiry, getAllInquiries } from '@/app/models/inquiry.model';
import { requireAuth } from '@/app/lib/auth';

// Public: submit an inquiry
export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.name || !body.email || !body.message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        const id = await createInquiry(body);
        return NextResponse.json({ message: 'Inquiry submitted', id }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Admin: get all inquiries
export async function GET(request) {
    try {
        const admin = requireAuth(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const inquiries = await getAllInquiries();
        return NextResponse.json(inquiries);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
