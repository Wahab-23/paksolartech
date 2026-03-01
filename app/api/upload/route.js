import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const ext = path.extname(file.name);
        const baseName = path.basename(file.name, ext)
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .toLowerCase();
        const uniqueName = `${baseName}-${Date.now()}${ext}`;

        // Ensure uploads/blogs directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, uniqueName);
        await writeFile(filePath, buffer);

        const url = `/uploads/blogs/${uniqueName}`;
        return NextResponse.json({ url, filename: uniqueName }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
