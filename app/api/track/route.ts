import { NextResponse } from 'next/server';
import { trackView } from '@/app/models/analytics.model';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        const { entity_type, entity_id } = await request.json();

        const ip = request.headers.get('x-forwarded-for') || '0.0.0.0';

        await trackView({
            entity_type,
            entity_id,
            viewer_id: session?.id || null,
            ip_address: ip,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
