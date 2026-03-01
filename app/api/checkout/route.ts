import { NextResponse } from 'next/server';
import { createOrder } from '@/app/models/order.model';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'customer') {
        return NextResponse.json({ error: 'Unauthorized. Please login as a customer to checkout.' }, { status: 401 });
    }

    try {
        const { items, total_amount } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        const orderId = await createOrder({
            customer_id: session.id,
            items,
            total_amount,
        });

        return NextResponse.json({
            message: 'Order placed successfully',
            orderId
        }, { status: 201 });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
