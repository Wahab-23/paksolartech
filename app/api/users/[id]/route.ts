import { NextResponse } from 'next/server';
import { updateUser } from '@/app/models/user.model';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    try {
        const body = await request.json();
        await updateUser(parseInt(id), body);
        return NextResponse.json({ message: 'User updated' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
