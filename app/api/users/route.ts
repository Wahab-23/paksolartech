import { NextResponse } from 'next/server';
import { createUser, getAllUsers } from '@/app/models/user.model';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    try {
        const users = await getAllUsers();
        return NextResponse.json(users);
    } catch (error: any) {
        console.error('Get users error:', error);
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
        const { name, email, password, role_id } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
        }

        const id = await createUser({ name, email, password, role_id: role_id || 4 });
        return NextResponse.json({ message: 'User created', id }, { status: 201 });
    } catch (error: any) {
        console.error('Create user error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
