'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Partner } from '@/lib/supabase';

interface InfiniteLogoSliderProps {
    speed?: number; // Animation duration in seconds (default: 30)
    pauseOnHover?: boolean; // Pause animation on hover (default: true)
    className?: string;
}

export default function InfiniteLogoSlider({
    speed = 30,
    pauseOnHover = true,
    className = '',
}: InfiniteLogoSliderProps) {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        async function fetchPartners() {
            try {
                const response = await fetch('/api/partners');
                if (response.ok) {
                    const data = await response.json();
                    setPartners(data);
                }
            } catch (error) {
                console.error('Error fetching partners:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPartners();
    }, []);

    // Don't render if no partners
    if (isLoading) {
        return (
            <div
                className={`flex items-center gap-8 md:gap-12 lg:gap-16 py-8 ${className}`}
                aria-hidden="true"
            >
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-12 w-32 md:h-14 md:w-40 bg-gray-200 rounded animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (partners.length === 0) {
        return null;
    }

    // Duplicate partners for seamless infinite loop
    const duplicatedPartners = [...partners, ...partners, ...partners];

    return (
        <div
            className={`relative overflow-hidden w-full ${className}`}
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
            {/* Gradient masks for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

            {/* Sliding track */}
            <div
                className="flex items-center gap-8 md:gap-12 lg:gap-16"
                style={{
                    animation: isPaused ? 'none' : `slide ${speed}s linear infinite`,
                }}
            >
                {duplicatedPartners.map((partner, index) => (
                    <div
                        key={`${partner.id}-${index}`}
                        className="flex-shrink-0 group relative"
                    >
                        <a
                            href={partner.link_url || '#'}
                            target={partner.link_url ? '_blank' : '_self'}
                            rel={partner.link_url ? 'noopener noreferrer' : undefined}
                            className="block"
                        >
                            <div className="relative h-12 md:h-14 w-32 md:w-40 flex items-center justify-center">
                                <Image
                                    src={partner.logo_url}
                                    alt={partner.name}
                                    fill
                                    className="object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                                    sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 160px"
                                />
                            </div>
                        </a>
                        {/* Category tooltip on hover */}
                        {partner.category && (
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                <span className="text-xs text-teal-600 font-semibold whitespace-nowrap bg-teal-50 px-2 py-1 rounded">
                                    {partner.category}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <style jsx global>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
        </div>
    );
}
