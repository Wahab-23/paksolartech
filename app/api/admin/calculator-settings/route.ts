import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
    getCalculatorSettings,
    upsertCalculatorSettings,
} from '@/app/models/calculator-settings.model';

async function requireAdmin() {
    const session = await getSession();
    if (!session || !['super_admin', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return null;
}

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        const settings = await getCalculatorSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Admin calculator settings GET error:', error);
        return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        const body = await req.json();
        await upsertCalculatorSettings(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin calculator settings PUT error:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
