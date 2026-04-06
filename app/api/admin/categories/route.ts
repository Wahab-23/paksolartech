import { NextResponse } from 'next/server';
import { createCategory, getAllCategories } from '@/app/models/product.model';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const categories = await getAllCategories();
        return NextResponse.json(categories);
    } catch (error: any) {
        console.error('Admin Fetch Categories error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const id = await createCategory(body);
        return NextResponse.json({ message: 'Category created', id }, { status: 201 });
    } catch (error: any) {
        console.error('Admin Create Category error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
