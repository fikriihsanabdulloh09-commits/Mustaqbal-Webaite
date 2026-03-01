'use server';

import { createClient, PortfolioItem, PortfolioItemFormData, PortfolioPageSettings } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// ============================================================
// HELPER: Upload image to Supabase Storage
// ============================================================
async function uploadPortfolioImage(file: File): Promise<string> {
    const supabase = createClient();

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `portfolio-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Error uploading image:', error);
        throw new Error('Gagal mengupload gambar');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

    return publicUrl;
}

// ============================================================
// PORTFOLIO ITEMS CRUD OPERATIONS
// ============================================================

/**
 * Fetch all portfolio items
 */
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching portfolio items:', error);
        throw new Error('Gagal mengambil data portfolio');
    }

    return data || [];
}

/**
 * Fetch featured portfolio items
 */
export async function getFeaturedPortfolios(limit: number = 3): Promise<PortfolioItem[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured portfolios:', error);
        throw new Error('Gagal mengambil data portfolio unggulan');
    }

    return data || [];
}

/**
 * Fetch portfolio item by ID
 */
export async function getPortfolioItemById(id: string): Promise<PortfolioItem | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching portfolio item:', error);
        return null;
    }

    return data;
}

/**
 * Create new portfolio item
 */
export async function createPortfolioItem(
    formData: PortfolioItemFormData,
    imageFile?: File
): Promise<{ success: boolean; data?: PortfolioItem; error?: string }> {
    try {
        const supabase = createClient();
        let imageUrl = formData.image_url || '';

        // Upload image if provided
        if (imageFile) {
            imageUrl = await uploadPortfolioImage(imageFile);
        }

        const { data, error } = await supabase
            .from('portfolio_items')
            .insert([{
                title: formData.title,
                student_name: formData.student_name,
                program: formData.program,
                category: formData.category,
                year: formData.year,
                description: formData.description || null,
                image_url: imageUrl || null,
                project_url: formData.project_url || null,
                is_featured: formData.is_featured || false,
            }])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/portfolio');
        revalidatePath('/admin/master/portfolio');

        return { success: true, data };
    } catch (error: any) {
        console.error('Error creating portfolio:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update existing portfolio item
 */
export async function updatePortfolioItem(
    id: string,
    formData: PortfolioItemFormData,
    imageFile?: File
): Promise<{ success: boolean; data?: PortfolioItem; error?: string }> {
    try {
        const supabase = createClient();
        let imageUrl = formData.image_url || '';

        // Upload new image if provided
        if (imageFile) {
            imageUrl = await uploadPortfolioImage(imageFile);
        }

        const { data, error } = await supabase
            .from('portfolio_items')
            .update({
                title: formData.title,
                student_name: formData.student_name,
                program: formData.program,
                category: formData.category,
                year: formData.year,
                description: formData.description || null,
                image_url: imageUrl || null,
                project_url: formData.project_url || null,
                is_featured: formData.is_featured || false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/portfolio');
        revalidatePath('/admin/master/portfolio');

        return { success: true, data };
    } catch (error: any) {
        console.error('Error updating portfolio:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete portfolio item
 */
export async function deletePortfolioItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = createClient();

        const { error } = await supabase
            .from('portfolio_items')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/portfolio');
        revalidatePath('/admin/master/portfolio');

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting portfolio:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Toggle featured status
 */
export async function togglePortfolioFeatured(
    id: string,
    isFeatured: boolean
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = createClient();

        const { error } = await supabase
            .from('portfolio_items')
            .update({ is_featured: isFeatured })
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/portfolio');
        revalidatePath('/admin/master/portfolio');

        return { success: true };
    } catch (error: any) {
        console.error('Error toggling featured:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================
// PORTFOLIO PAGE SETTINGS OPERATIONS
// ============================================================

/**
 * Get portfolio page settings from page_settings table
 */
export async function getPortfolioPageSettings(): Promise<PortfolioPageSettings> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('page_settings')
        .select('content')
        .eq('page_name', 'portfolio')
        .single();

    if (error || !data) {
        console.error('Error fetching portfolio settings:', error);
        // Return default settings
        return {
            page_title: 'Portfolio Karya Siswa',
            page_subtitle: 'Lihat karya terbaik dari siswa-siswi SMK Mustaqbal',
            show_filter: true,
            show_search: true,
            categories: ['Semua', 'Teknik', 'Design', 'Web Development', 'Networking', 'Mobile Development', 'Robotik'],
            display_style: 'grid',
            items_per_page: 12,
        };
    }

    return data.content as PortfolioPageSettings;
}

/**
 * Update portfolio page settings
 */
export async function updatePortfolioPageSettings(
    settings: PortfolioPageSettings
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = createClient();

        const { error } = await supabase
            .from('page_settings')
            .upsert({
                page_name: 'portfolio',
                content: settings as Record<string, unknown>,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'page_name'
            });

        if (error) throw error;

        revalidatePath('/portfolio');
        revalidatePath('/admin/pages/portfolio');

        return { success: true };
    } catch (error: any) {
        console.error('Error updating portfolio settings:', error);
        return { success: false, error: error.message };
    }
}
