import { NextResponse } from 'next/server';
import { createProduct, getAllProducts } from '@/app/models/product.model';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const products = await getAllProducts();
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const id = await createProduct(body);
        return NextResponse.json({ message: 'Product created', id }, { status: 201 });
    } catch (error: any) {
        console.error('Admin Create Product error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
