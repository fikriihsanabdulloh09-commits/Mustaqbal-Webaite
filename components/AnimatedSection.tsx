'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: string;
  delay?: number;
  threshold?: number;
  className?: string;
}

export function AnimatedSection({
  children,
  animation = 'fadeIn',
  delay = 0,
  threshold = 0.1,
  className = '',
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce: true });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && sectionRef.current) {
      // Apply animation after delay
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.classList.add('opacity-100');
          if (animation && animation !== 'none') {
            sectionRef.current.classList.add(`animate-${animation}`);
          }
        }
      }, delay);
    }
  }, [isVisible, animation, delay]);

  return (
    <div
      ref={(node) => {
        // @ts-ignore
        ref.current = node;
        // @ts-ignore
        sectionRef.current = node;
      }}
      className={`opacity-0 transition-opacity ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ScrollReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div ref={ref as any} className={`scroll-reveal ${isVisible ? 'revealed' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function StaggeredReveal({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div
      ref={ref as any}
      className={`scroll-reveal-stagger ${isVisible ? 'revealed' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
