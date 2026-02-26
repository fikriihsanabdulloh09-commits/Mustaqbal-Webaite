'use client';

import { motion } from 'framer-motion';
import { Layers, Award, Briefcase } from 'lucide-react';

const features = [
  {
    icon: Layers,
    color: 'blue',
    title: 'Pembelajaran 70% Praktik',
    description:
      'Metode pembelajaran hands-on di laboratorium modern memastikan siswa memiliki skill teknis yang kuat sesuai standar industri.',
  },
  {
    icon: Award,
    color: 'teal',
    title: 'Guru Praktisi & Ahli',
    description:
      'Dididik langsung oleh tenaga pengajar bersertifikat dan praktisi industri yang berpengalaman di bidangnya masing-masing.',
  },
  {
    icon: Briefcase,
    color: 'amber',
    title: 'Penyaluran Kerja',
    description:
      'Kerjasama dengan 50+ perusahaan multinasional untuk program magang dan rekrutmen langsung setelah lulus.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-3">Kenapa Memilih Kami?</h2>
          <h3 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Keunggulan Akademik & Fasilitas Terbaik
          </h3>
          <p className="text-slate-600 text-lg">
            Kami tidak hanya mencetak lulusan yang pintar secara teori, tetapi juga terampil, berkarakter, dan
            siap bersaing di era global.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className={`w-16 h-16 rounded-2xl bg-${feature.color}-100 text-${feature.color}-600 flex items-center justify-center mb-6`}
              >
                <feature.icon className="w-8 h-8" />
              </motion.div>
              <h4 className="text-xl font-heading font-bold text-slate-800 mb-4">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
