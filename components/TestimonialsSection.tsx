'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Testimonial } from '@/lib/supabase';

interface TestimonialsSectionProps {
  settings?: {
    section_title?: string;
    section_subtitle?: string;
  };
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ settings, testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-teal-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full mix-blend-overlay filter blur-3xl translate-y-1/3 -translate-x-1/3"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-teal-300 font-bold tracking-wider uppercase text-sm mb-3">Kisah Sukses</h2>
          <h3 className="font-heading text-3xl md:text-4xl font-bold text-white">{settings?.section_title || 'Apa Kata Alumni Kami?'}</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl relative hover:bg-white/10 transition-colors"
            >
              <Quote className="absolute top-6 right-6 text-teal-500/30 w-10 h-10" />
              <p className="text-slate-200 italic leading-relaxed mb-8 relative z-10">
                &ldquo;{testimonial.testimonial_text}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                {testimonial.avatar_url ? (
                  <Image
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-teal-500 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-teal-500 bg-teal-600 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                  <div className="text-xs text-teal-300">Alumni {testimonial.program}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">
                    {testimonial.current_position} di {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
