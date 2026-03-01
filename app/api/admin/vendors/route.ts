import { NextResponse } from 'next/server';
import { getAllVendors } from '@/app/models/vendor.model';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const vendors = await getAllVendors();
        return NextResponse.json(vendors);
    } catch (error: any) {
        console.error('Admin Fetch Vendors error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
