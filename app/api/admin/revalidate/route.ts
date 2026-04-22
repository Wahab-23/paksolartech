import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAuth } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const admin = requireAuth(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, tag } = body;

        if (type === 'all') {
            // Revalidate everything
            revalidatePath('/', 'layout');
            // Also explicitly clear main tags just to be safe
            revalidateTag('blogs', 'max');
            revalidateTag('services', 'max');
            revalidateTag('faqs', 'max');
            revalidateTag('products', 'max');
            revalidateTag('categories', 'max');
            revalidateTag('calculator-settings', 'max');

            return NextResponse.json({ message: 'Entire site cache revalidated successfully' });
        }

        if (type === 'tag' && tag) {
            revalidateTag(tag, 'max');
            return NextResponse.json({ message: `Cache for tag "${tag}" revalidated successfully` });
        }

        return NextResponse.json({ error: 'Invalid revalidation type' }, { status: 400 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to revalidate cache' }, { status: 500 });
    }
}
