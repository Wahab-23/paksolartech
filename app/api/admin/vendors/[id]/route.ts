import { NextResponse } from 'next/server';
import { getVendorById, updateVendor } from '@/app/models/vendor.model';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const vendor = await getVendorById(parseInt(id));
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    return NextResponse.json(vendor);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        await updateVendor(parseInt(id), body);
        return NextResponse.json({ message: 'Vendor updated' });
    } catch (error: any) {
        console.error('Admin Update Vendor error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
