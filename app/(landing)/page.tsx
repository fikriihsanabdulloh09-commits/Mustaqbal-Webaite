import { createClient } from '@/lib/supabase';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import ProgramsSection from '@/components/ProgramsSection';
import PartnersSection from '@/components/PartnersSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsSection from '@/components/NewsSection';

export const revalidate = 0; // Always fetch fresh settings from DB

async function getBerandaSettings() {
    const supabase = createClient();
    const { data } = await supabase
        .from('page_settings')
        .select('content')
        .eq('page_name', 'beranda')
        .maybeSingle();
    return data?.content as Record<string, any> | null;
}

export default async function Home() {
    const settings = await getBerandaSettings();

    return (
        <>
            <Hero settings={settings?.hero} />
            <FeaturesSection settings={settings?.features} />
            <ProgramsSection settings={settings?.programs} />
            <PartnersSection settings={settings?.partners} />
            <TestimonialsSection settings={settings?.testimonials} />
            <NewsSection settings={settings?.news} />
        </>
    );
}
