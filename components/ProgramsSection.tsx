'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Palette, Monitor, Code, GraduationCap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { supabase, type Program } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

// Legacy icon map for backwards compatibility
const legacyIconMap: Record<string, any> = {
  cpu: Cpu,
  palette: Palette,
  monitor: Monitor,
  code: Code,
};

// Get icon component dynamically from Lucide
function getIconComponent(iconName: string) {
  if (!iconName) return GraduationCap;

  // Check legacy map first
  if (legacyIconMap[iconName]) {
    return legacyIconMap[iconName];
  }

  // Try to get from Lucide icons
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || GraduationCap;
}

const colorMap: Record<string, { from: string; to: string; bg: string }> = {
  blue: { from: 'from-blue-500', to: 'to-cyan-500', bg: 'bg-blue-500' },
  orange: { from: 'from-orange-500', to: 'to-red-500', bg: 'bg-orange-500' },
  green: { from: 'from-emerald-500', to: 'to-teal-500', bg: 'bg-emerald-500' },
  purple: { from: 'from-purple-500', to: 'to-indigo-500', bg: 'bg-purple-500' },
};

export default function ProgramsSection({ settings }: { settings?: { section_title?: string; section_subtitle?: string } }) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('is_active', true)
          .order('order_position');

        if (error) throw error;
        setPrograms(data || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-3">Program Keahlian</h2>
            <h3 className="font-heading text-3xl md:text-4xl font-bold text-slate-900">
              {settings?.section_title || 'Siapkan Diri Menjadi Ahli'}
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/program">
              <Button variant="ghost" className="hidden md:flex items-center gap-2 text-teal-600 hover:text-teal-700">
                Lihat Selengkapnya <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => {
            const Icon = getIconComponent(program.icon);
            const colors = colorMap[program.color_theme] || colorMap.blue;

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${colors.from} ${colors.to} opacity-0 group-hover:opacity-20 transition-opacity z-10`}
                  ></div>
                  {program.image_url ? (
                    <img
                      src={program.image_url}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${colors.from} ${colors.to}`}></div>
                  )}
                  <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg z-20 text-slate-700">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-heading text-xl font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors">
                    {program.title}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{program.description}</p>
                  <Link href={`/program/${program.slug}`}>
                    <button className="w-full py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-all">
                      Lihat Detail
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
