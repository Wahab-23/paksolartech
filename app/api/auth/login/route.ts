import { NextResponse } from 'next/server';
import { authenticateUser } from '@/app/models/user.model';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const trimmedEmail = email.trim().toLowerCase();
        const user = await authenticateUser(trimmedEmail, password);
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        if (!user.is_active) {
            return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 });
        }

        const token = await createToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        await setAuthCookie(token);

        return NextResponse.json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
