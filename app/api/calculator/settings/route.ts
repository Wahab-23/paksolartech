import { NextResponse } from 'next/server';
import { getCalculatorSettings } from '@/app/models/calculator-settings.model';

// Public endpoint — no auth required
export async function GET() {
    try {
        const settings = await getCalculatorSettings();
        return NextResponse.json(settings, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
        });
    } catch (error) {
        console.error('Calculator settings GET error:', error);
        return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
    }
}
