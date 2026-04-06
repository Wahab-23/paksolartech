import { NextResponse } from 'next/server';
import { updateCategory, deleteCategory, getCategoryById } from '@/app/models/product.model';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const cat = await getCategoryById(id);
        if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(cat);
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
        await updateCategory(id, body);
        return NextResponse.json({ message: 'Category updated' });
    } catch (error: any) {
        console.error('Admin Update Category error:', error);
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
        await deleteCategory(id);
        return NextResponse.json({ message: 'Category deleted' });
    } catch (error: any) {
        console.error('Admin Delete Category error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
