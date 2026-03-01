'use server';

import { createClient, BerandaSettings } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export type { BerandaSettings };

// ============================================================
// BERANDA-SPECIFIC (backward compat)
// ============================================================
export async function getBerandaSettings(): Promise<BerandaSettings | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('page_settings')
        .select('content')
        .eq('page_name', 'beranda')
        .maybeSingle();

    if (error) {
        console.error('Error fetching beranda settings:', error);
        return null;
    }

    return data?.content as BerandaSettings | null;
}

export async function updateBerandaSettings(settings: BerandaSettings): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    const { error } = await supabase
        .from('page_settings')
        .upsert({
            page_name: 'beranda',
            content: settings,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'page_name'
        });

    if (error) {
        console.error('Error updating beranda settings:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/');
    return { success: true };
}

// ============================================================
// GENERIC — untuk semua halaman CMS
// ============================================================

/**
 * Ambil pengaturan halaman berdasarkan nama.
 * @param pageName - Nama halaman (e.g. 'tentang-kami', 'program-keahlian', 'beranda')
 * @returns Objek content (JSONB) atau null jika belum ada
 */
export async function getPageSettings<T = Record<string, unknown>>(pageName: string): Promise<T | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('page_settings')
        .select('content')
        .eq('page_name', pageName)
        .maybeSingle();

    if (error) {
        console.error(`Error fetching settings for "${pageName}":`, error);
        return null;
    }

    return (data?.content as T) ?? null;
}

/**
 * Upsert pengaturan halaman (insert jika belum ada, update jika sudah).
 * @param pageName - Nama halaman
 * @param content - Objek JSONB yang akan disimpan
 */
export async function updatePageSettings(
    pageName: string,
    content: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    const { error } = await supabase
        .from('page_settings')
        .upsert({
            page_name: pageName,
            content,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'page_name'
        });

    if (error) {
        console.error(`Error updating settings for "${pageName}":`, error);
        return { success: false, error: error.message };
    }

    revalidatePath('/');
    return { success: true };
}

