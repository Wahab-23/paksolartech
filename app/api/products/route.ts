import { NextResponse } from 'next/server';
import { getAllProducts, getAllCategories } from '@/app/models/product.model';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category') || 'all';
    const featured = searchParams.get('featured') === 'true';

    try {
        let products = await getAllProducts({ activeOnly: true });
        const categories = await getAllCategories();

        if (categorySlug !== 'all') {
            const category = categories.find((c: any) => c.slug === categorySlug);
            if (category) {
                products = products.filter((p: any) => p.category_id === category.id);
            } else {
                products = [];
            }
        }

        if (featured) {
            products = products.filter((p: any) => p.is_featured);
        }

        return NextResponse.json({ products, categories });
    } catch (error) {
        console.error('Public Fetch Products error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
