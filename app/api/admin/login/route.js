import { NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/app/models/admin.model';
import { signToken } from '@/app/lib/auth';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const admin = await verifyAdminPassword(email, password);

        if (!admin) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const token = signToken({ id: admin.id, email: admin.email, name: admin.name });

        const response = NextResponse.json({
            message: 'Login successful',
            token,
            admin: { id: admin.id, name: admin.name, email: admin.email },
        });

        // Also set as httpOnly cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
