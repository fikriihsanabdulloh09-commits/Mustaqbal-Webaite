import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import ProgramsSection from '@/components/ProgramsSection';
import PartnersSection from '@/components/PartnersSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsSection from '@/components/NewsSection';

export default function Home() {
    return (
        <>
            <Hero />
            <FeaturesSection />
            <ProgramsSection />
            <PartnersSection />
            <TestimonialsSection />
            <NewsSection />
        </>
    );
}