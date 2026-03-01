import { createClient } from '@/lib/supabase';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import ProgramsSection from '@/components/ProgramsSection';
import PartnersSection from '@/components/PartnersSection';
import MitraIndustri from '@/components/MitraIndustri';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsSection from '@/components/NewsSection';
import { Program, Testimonial, NewsArticle } from '@/lib/supabase';

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

async function getBerandaSettings() {
    const supabase = createClient();
    const { data } = await supabase
        .from('page_settings')
        .select('content')
        .eq('page_name', 'beranda')
        .maybeSingle();
    return data?.content as Record<string, any> | null;
}

async function getPrograms() {
    const supabase = createClient();
    const { data } = await supabase
        .from('programs')
        .select('*')
        .eq('is_active', true)
        .order('order_position');
    return data as Program[] || [];
}

async function getTestimonials() {
    const supabase = createClient();
    const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);
    return data as Testimonial[] || [];
}

async function getNews() {
    const supabase = createClient();
    const { data } = await supabase
        .from('news_articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);
    return data as NewsArticle[] || [];
}

export default async function Home() {
    // Fetch all data on the server
    const [settings, programs, testimonials, news] = await Promise.all([
        getBerandaSettings(),
        getPrograms(),
        getTestimonials(),
        getNews(),
    ]);

    return (
        <>
            <Hero settings={settings?.hero} />
            <FeaturesSection settings={settings?.features} />
            <ProgramsSection
                settings={settings?.programs}
                programs={programs}
            />
            <PartnersSection settings={settings?.partners} />
            <MitraIndustri hideTitle />
            <TestimonialsSection
                settings={settings?.testimonials}
                testimonials={testimonials}
            />
            <NewsSection
                settings={settings?.news}
                news={news}
            />
        </>
    );
}
