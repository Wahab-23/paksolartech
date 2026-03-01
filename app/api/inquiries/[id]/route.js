import { NextResponse } from 'next/server';
import { getInquiryById, markInquiryRead, deleteInquiry } from '@/app/models/inquiry.model';
import { requireAuth } from '@/app/lib/auth';

// Admin: get single inquiry
export async function GET(request, context) {
    try {
        const admin = requireAuth(request);
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const params = await context.params;
        const inquiry = await getInquiryById(params.id);
        if (!inquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json(inquiry);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Admin: mark as read
export async function PUT(request, context) {
    try {
        const admin = requireAuth(request);
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const params = await context.params;
        await markInquiryRead(params.id);
        return NextResponse.json({ message: 'Marked as read' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Admin: delete inquiry
export async function DELETE(request, context) {
    try {
        const admin = requireAuth(request);
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const params = await context.params;
        await deleteInquiry(params.id);
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
