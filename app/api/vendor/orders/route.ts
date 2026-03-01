import { NextResponse } from 'next/server';
import { getOrdersByVendorId } from '@/app/models/order.model';
import { getVendorByUserId } from '@/app/models/vendor.model';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'vendor') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vendor = await getVendorByUserId(session.id);
    if (!vendor) return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });

    const orders = await getOrdersByVendorId(vendor.id);
    return NextResponse.json(orders);
}
