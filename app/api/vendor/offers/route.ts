import { NextResponse } from 'next/server';
import { createOffer, getOffersByVendorId } from '@/app/models/offer.model';
import { getVendorByUserId } from '@/app/models/vendor.model';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'vendor') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const vendor = await getVendorByUserId(session.id);
    if (!vendor || !vendor.is_approved) {
        return NextResponse.json({ error: 'Vendor not approved' }, { status: 403 });
    }

    const offers = await getOffersByVendorId(vendor.id);
    return NextResponse.json(offers);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'vendor') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const vendor = await getVendorByUserId(session.id);
    if (!vendor || !vendor.is_approved) {
        return NextResponse.json({ error: 'Vendor not approved' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const id = await createOffer({ ...body, vendor_id: vendor.id });
        return NextResponse.json({ message: 'Offer created', id }, { status: 201 });
    } catch (error: any) {
        console.error('Vendor Create Offer error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
