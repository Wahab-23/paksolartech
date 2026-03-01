import { NextResponse } from 'next/server';
import { getOrdersByCustomerId } from '@/app/models/order.model';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'customer') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await getOrdersByCustomerId(session.id);
    return NextResponse.json(orders);
}
