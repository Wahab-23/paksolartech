import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/app/models/user.model';
import { createVendor } from '@/app/models/vendor.model';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { name, email, password, business_name, description } = await request.json();

        if (!name || !email || !password || !business_name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existing = await getUserByEmail(email);
        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // 1. Create User (Role ID 3 = Vendor)
        const userId = await createUser({ name, email, password, role_id: 3 });

        // 2. Create Vendor Profile (Pending Approval)
        await createVendor({
            user_id: userId,
            business_name,
            description,
            is_approved: false,
        });

        const user = { id: userId, name, email, role: 'vendor' } as any;
        const token = await createToken(user);
        await setAuthCookie(token);

        return NextResponse.json({
            message: 'Vendor registration submitted for approval',
            user
        }, { status: 201 });
    } catch (error: any) {
        console.error('Vendor registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
