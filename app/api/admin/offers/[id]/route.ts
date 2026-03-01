import { NextResponse } from 'next/server';
import { updateOffer, deleteOffer } from '@/app/models/offer.model';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        await updateOffer(parseInt(params.id), body);
        return NextResponse.json({ message: 'Offer updated' });
    } catch (error: any) {
        console.error('Admin Update Offer error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await deleteOffer(parseInt(params.id));
        return NextResponse.json({ message: 'Offer deleted' });
    } catch (error: any) {
        console.error('Admin Delete Offer error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
