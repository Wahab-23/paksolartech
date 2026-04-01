import { NextResponse } from 'next/server';
import { products, categories } from '@/lib/dummyProducts';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category') || 'all';
    const featured = searchParams.get('featured') === 'true';

    let result = products.filter((p) => p.status === 'active');

    if (categorySlug !== 'all') {
        result = result.filter((p) => p.category_slug === categorySlug);
    }

    if (featured) {
        result = result.filter((p) => p.is_featured);
    }

    return NextResponse.json({ products: result, categories });
}
