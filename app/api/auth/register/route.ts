import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/app/models/user.model';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { name, email, password, role_id } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existing = await getUserByEmail(email);
        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Create user (default role 4 = customer, unless specified)
        // Validate role_id to prevent unauthorized registration as admin
        const targetRole = [3, 4].includes(role_id) ? role_id : 4; // Only allow Vendor (3) or Customer (4) for public registration

        const id = await createUser({ name, email, password, role_id: targetRole });
        const user = { id, name, email, role: targetRole === 3 ? 'vendor' : 'customer' } as any;

        const token = await createToken(user);
        await setAuthCookie(token);

        return NextResponse.json({ message: 'Registration successful', user }, { status: 201 });
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
