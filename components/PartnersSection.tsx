'use client';

import { motion } from 'framer-motion';
import InfiniteLogoSlider from './InfiniteLogoSlider';

interface PartnersSettings {
  section_title?: string;
  section_subtitle?: string;
  statistics?: Array<{ value: string; label: string }>;
}

export default function PartnersSection({ settings }: { settings?: PartnersSettings }) {
  const stats = settings?.statistics || [
    { value: '50+', label: 'Mitra Industri' },
    { value: '90%', label: 'Siswa Tersalurkan' },
    { value: '1000+', label: 'Alumni Bekerja' },
  ];
  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-3">Kerjasama Industri</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {settings?.section_title || 'Dipercaya oleh Perusahaan Terkemuka'}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {settings?.section_subtitle || 'Lebih dari 50+ perusahaan bermitra dengan kami untuk program magang, rekrutmen, dan pengembangan kurikulum'}
          </p>
        </motion.div>

        <InfiniteLogoSlider speed={30} pauseOnHover={true} className="mb-12" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-8">
                {index > 0 && <div className="w-px h-12 bg-teal-200"></div>}
                <div className="text-center">
                  <div className="text-3xl font-black text-teal-600">{stat.value}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
