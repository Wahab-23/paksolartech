import { NextResponse } from 'next/server';
import { createBlog, getAllBlogs } from '@/app/models/blog.model';
import { requireAuth } from '@/app/lib/auth';

// Public: get all published blogs  |  Admin: get all blogs
export async function GET(request) {
    try {
        const admin = requireAuth(request);
        const blogs = await getAllBlogs({ publishedOnly: !admin });
        return NextResponse.json(blogs);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Admin: create a blog
export async function POST(request) {
    try {
        const admin = requireAuth(request);
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        if (!body.title || !body.content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const id = await createBlog(body);
        return NextResponse.json({ message: 'Blog created', id }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
