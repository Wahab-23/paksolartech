import { NextResponse } from 'next/server';
import { getBlogById, updateBlog, deleteBlog } from '@/app/models/blog.model';
import { requireAuth } from '@/app/lib/auth';

// Public/Admin: get blog by id
export async function GET(request, context) {
    try {
        const params = await context.params;
        const blog = await getBlogById(params.id);
        if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Admin: update blog
export async function PUT(request, context) {
    try {
        const admin = requireAuth(request);
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const params = await context.params;
        const body = await request.json();
        await updateBlog(params.id, body);
        return NextResponse.json({ message: 'Blog updated' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Admin: delete blog
export async function DELETE(request, context) {
    try {
        const admin = requireAuth(request);
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const params = await context.params;
        await deleteBlog(params.id);
        return NextResponse.json({ message: 'Blog deleted' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
