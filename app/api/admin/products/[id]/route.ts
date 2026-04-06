import { NextResponse } from 'next/server';
import { updateProduct, deleteProduct, getProductById } from '@/app/models/product.model';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const product = await getProductById(id);
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        await updateProduct(id, body);
        return NextResponse.json({ message: 'Product updated' });
    } catch (error: any) {
        console.error('Admin Update Product error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await deleteProduct(id);
        return NextResponse.json({ message: 'Product deleted' });
    } catch (error: any) {
        console.error('Admin Delete Product error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
