import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching partners:', error);
        return NextResponse.json(
            { error: 'Failed to fetch partners' },
            { status: 500 }
        );
    }

    return NextResponse.json(data || []);
}
