import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('page_settings')
            .select('content')
            .eq('page_name', 'beranda')
            .maybeSingle();

        if (error) {
            console.error('Error fetching beranda settings:', error);
            return NextResponse.json(
                { error: 'Failed to fetch settings' },
                { status: 500 }
            );
        }

        return NextResponse.json(data?.content || {});
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const { error } = await supabase
            .from('page_settings')
            .upsert({
                page_name: 'beranda',
                content: body,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'page_name'
            });

        if (error) {
            console.error('Error updating beranda settings:', error);
            return NextResponse.json(
                { error: 'Failed to update settings' },
                { status: 500 }
            );
        }

        revalidatePath('/');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
