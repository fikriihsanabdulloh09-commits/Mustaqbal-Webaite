import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Export createClient function for admin pages
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export type Program = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string | null;
  color_theme: string;
  facilities: string[];
  career_prospects: string[];
  is_active: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  author: string;
  published_at: string;
  is_published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  media_type: 'foto' | 'video';
  media_url: string;
  thumbnail_url: string | null;
  category: string;
  is_featured: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  program: string;
  graduation_year: number;
  current_position: string;
  company: string;
  testimonial_text: string;
  avatar_url: string | null;
  is_featured: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
};

export type PPDBSubmission = {
  full_name: string;
  email?: string;
  phone: string;
  whatsapp: string;
  origin_school: string;
  chosen_program?: string;
  address?: string;
  parent_name?: string;
  parent_phone?: string;
};

export type EBrochureDownload = {
  full_name: string;
  whatsapp: string;
  origin_school: string;
  email?: string;
  ip_address?: string;
};
