import { NextResponse } from 'next/server';
import { getAdminStats } from '@/app/models/analytics.model';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const stats = await getAdminStats();
        return NextResponse.json(stats);
    } catch (error: any) {
        console.error('Admin Stats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
