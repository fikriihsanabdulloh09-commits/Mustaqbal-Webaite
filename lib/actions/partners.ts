'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase';
import { Partner, PartnerFormData } from '@/lib/supabase';

/**
 * Server Actions for Partners Management
 * 
 * Workflow:
 * 1. getPartners - Fetch all active partners sorted by sort_order ASC
 * 2. getPartnerById - Fetch single partner by ID
 * 3. createPartner - Create new partner with image upload
 * 4. updatePartner - Update existing partner
 * 5. deletePartner - Delete partner (and associated image)
 */

// Fetch all active partners sorted by sort_order ASC
export async function getPartners(): Promise<Partner[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching partners:', error);
        throw new Error('Failed to fetch partners');
    }

    return data || [];
}

// Fetch all partners (including inactive) for admin
export async function getAllPartners(): Promise<Partner[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching all partners:', error);
        throw new Error('Failed to fetch partners');
    }

    return data || [];
}

// Fetch single partner by ID
export async function getPartnerById(id: string): Promise<Partner | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching partner:', error);
        return null;
    }

    return data;
}

// Upload image to Supabase Storage
async function uploadPartnerLogo(
    file: File,
    partnerId: string
): Promise<string> {
    const supabase = createClient();

    // Generate unique filename: partner_{id}_{timestamp}_{originalname}
    const timestamp = Date.now();
    const fileName = `partner_${partnerId}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to partner-logos bucket
    const { data, error } = await supabase.storage
        .from('partner-logos')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
        });

    if (error) {
        console.error('Error uploading logo:', error);
        throw new Error('Failed to upload logo');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('partner-logos')
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

// Delete image from Supabase Storage
async function deletePartnerLogo(logoUrl: string): Promise<void> {
    const supabase = createClient();

    // Extract file path from URL using URL object for robustness
    try {
        const url = new URL(logoUrl);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];

        if (!fileName) return;

        const { error } = await supabase.storage
            .from('partner-logos')
            .remove([fileName]);

        if (error) {
            console.error('Error deleting logo:', error);
            // Don't throw - image deletion failure shouldn't block partner deletion
        }
    } catch (err) {
        console.error('Error parsing logo URL:', err);
    }
}

// Server-side validation
function validatePartnerForm(data: PartnerFormData): string[] {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
        errors.push('Name is required');
    }

    if (!data.logo_url || data.logo_url.trim().length === 0) {
        errors.push('Logo URL is required');
    }

    if (data.sort_order === undefined || data.sort_order === null) {
        errors.push('Sort order is required');
    } else if (typeof data.sort_order !== 'number' || data.sort_order < 0) {
        errors.push('Sort order must be a positive number');
    }

    return errors;
}

// Create new partner
export async function createPartner(
    formData: PartnerFormData,
    logoFile?: File
): Promise<{ success: boolean; data?: Partner; error?: string }> {
    const supabase = createClient();

    // Server-side validation
    const validationErrors = validatePartnerForm(formData);
    if (validationErrors.length > 0) {
        return { success: false, error: validationErrors.join(', ') };
    }

    try {
        // Generate a temporary ID for the file name
        const tempId = crypto.randomUUID();

        let logoUrl = formData.logo_url;

        // If there's a new logo file, upload it
        if (logoFile) {
            logoUrl = await uploadPartnerLogo(logoFile, tempId);
        }

        // Insert partner data
        const { data, error } = await supabase
            .from('partners')
            .insert({
                name: formData.name.trim(),
                logo_url: logoUrl,
                link_url: formData.link_url?.trim() || null,
                sort_order: formData.sort_order,
                is_active: formData.is_active ?? true,
                category: formData.category?.trim() || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating partner:', error);
            return { success: false, error: error.message };
        }

        // Revalidate the partners page
        revalidatePath('/');
        revalidatePath('/admin/mitra');

        return { success: true, data: data };
    } catch (error) {
        console.error('Error in createPartner:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create partner'
        };
    }
}

// Update existing partner
export async function updatePartner(
    id: string,
    formData: PartnerFormData,
    logoFile?: File
): Promise<{ success: boolean; data?: Partner; error?: string }> {
    const supabase = createClient();

    // Server-side validation
    const validationErrors = validatePartnerForm(formData);
    if (validationErrors.length > 0) {
        return { success: false, error: validationErrors.join(', ') };
    }

    try {
        let logoUrl = formData.logo_url;

        // If there's a new logo file, upload it FIRST
        if (logoFile) {
            // Upload new logo first
            logoUrl = await uploadPartnerLogo(logoFile, id);

            // THEN delete old logo (only after new upload succeeds)
            if (formData.logo_url) {
                await deletePartnerLogo(formData.logo_url);
            }
        }

        // Update partner data
        const { data, error } = await supabase
            .from('partners')
            .update({
                name: formData.name.trim(),
                logo_url: logoUrl,
                link_url: formData.link_url?.trim() || null,
                sort_order: formData.sort_order,
                is_active: formData.is_active ?? true,
                category: formData.category?.trim() || null,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating partner:', error);
            return { success: false, error: error.message };
        }

        // Revalidate the partners page
        revalidatePath('/');
        revalidatePath('/admin/mitra');

        return { success: true, data: data };
    } catch (error) {
        console.error('Error in updatePartner:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update partner'
        };
    }
}

// Delete partner
export async function deletePartner(
    id: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    try {
        // Get partner to delete its logo
        const partner = await getPartnerById(id);
        if (partner?.logo_url) {
            await deletePartnerLogo(partner.logo_url);
        }

        // Delete partner from database
        const { error } = await supabase
            .from('partners')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting partner:', error);
            return { success: false, error: error.message };
        }

        // Revalidate the partners page
        revalidatePath('/');
        revalidatePath('/admin/mitra');

        return { success: true };
    } catch (error) {
        console.error('Error in deletePartner:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete partner'
        };
    }
}

// Toggle partner active status
export async function togglePartnerStatus(
    id: string,
    isActive: boolean
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from('partners')
            .update({ is_active: isActive })
            .eq('id', id);

        if (error) {
            console.error('Error toggling partner status:', error);
            return { success: false, error: error.message };
        }

        // Revalidate the partners page
        revalidatePath('/');
        revalidatePath('/admin/mitra');

        return { success: true };
    } catch (error) {
        console.error('Error in togglePartnerStatus:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to toggle partner status'
        };
    }
}
