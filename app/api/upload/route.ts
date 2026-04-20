import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const uploadPath = formData.get('path') as string || 'blogs'; // Default to blogs if no path provided

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

        // Ensure uploads directory exists with the specified path
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', uploadPath);
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, uniqueName);
        await writeFile(filePath, buffer);

        const url = `/uploads/${uploadPath}/${uniqueName}`;
        return NextResponse.json({ url, filename: uniqueName }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
