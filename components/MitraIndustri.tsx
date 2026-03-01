'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getPageSettings } from '@/lib/actions/page-settings';

interface Mitra {
    id: string;
    nama: string;
    logo_url: string;
}

interface BerandaContent {
    partners?: {
        mitra?: Mitra[];
    };
}

interface MitraIndustriProps {
    title?: string;
    subtitle?: string;
    hideTitle?: boolean;
}

export default function MitraIndustri({
    title = 'Mitra Industri',
    subtitle = 'Bekerja sama dengan perusahaan ternama untuk memberikan pengalaman terbaik',
    hideTitle = false,
}: MitraIndustriProps) {
    const [mitraList, setMitraList] = useState<Mitra[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMitra() {
            setIsLoading(true);
            try {
                const content = await getPageSettings<BerandaContent>('beranda');
                if (content?.partners?.mitra && content.partners.mitra.length > 0) {
                    setMitraList(content.partners.mitra);
                }
            } catch (error) {
                console.error('Error fetching mitra:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMitra();
    }, []);

    // Jika data sedikit (< 10), kalikan array agar cukup panjang untuk seamless scroll
    const extendedMitraList =
        mitraList.length > 0 && mitraList.length < 10
            ? Array.from({ length: 6 }).flatMap(() => mitraList)
            : mitraList;

    if (isLoading) {
        return (
            <section className="py-16 bg-muted/30 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
                        <div className="animate-pulse bg-muted h-4 w-64 mx-auto rounded"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (mitraList.length === 0) {
        return null; // Hide section if no data
    }

    return (
        <section className="py-16 bg-muted/30 overflow-hidden">
            {!hideTitle && (
                <div className="container mx-auto px-4 mb-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
                        <p className="text-muted-foreground">{subtitle}</p>
                    </div>
                </div>
            )}

            {/* Marquee Container */}
            <div className="relative group">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

                {/* Scrolling Container - 2 wrappers for true infinite effect */}
                <div className="flex overflow-hidden">
                    {/* Wrapper 1 */}
                    <div className="flex flex-shrink-0 animate-infinite-scroll gap-12 min-w-full justify-around group-hover:[animation-play-state:paused]">
                        {extendedMitraList.map((mitra, index) => (
                            <div
                                key={`w1-${mitra.id}-${index}`}
                                className="flex-shrink-0 px-4 py-3 bg-white rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="relative h-12 w-32 flex items-center justify-center">
                                    <Image
                                        src={mitra.logo_url}
                                        alt={mitra.nama}
                                        fill
                                        className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Wrapper 2 (identical) - for seamless loop */}
                    <div className="flex flex-shrink-0 animate-infinite-scroll gap-12 min-w-full justify-around group-hover:[animation-play-state:paused]">
                        {extendedMitraList.map((mitra, index) => (
                            <div
                                key={`w2-${mitra.id}-${index}`}
                                className="flex-shrink-0 px-4 py-3 bg-white rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="relative h-12 w-32 flex items-center justify-center">
                                    <Image
                                        src={mitra.logo_url}
                                        alt={mitra.nama}
                                        fill
                                        className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
