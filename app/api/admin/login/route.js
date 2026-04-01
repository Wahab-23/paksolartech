import { NextResponse } from 'next/server';
import { authenticateUser } from '@/app/models/user.model';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const trimmedEmail = email.trim().toLowerCase();
        const user = await authenticateUser(trimmedEmail, password);

        if (!user || !['super_admin', 'admin'].includes(user.role)) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const token = await createToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        await setAuthCookie(token);

        return NextResponse.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Legacy Admin Login error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
