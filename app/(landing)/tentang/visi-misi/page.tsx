'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Wrench, Cpu, CheckCircle, BookOpen, Handshake, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function VisiMisiPage() {
  const [hoveredMission, setHoveredMission] = useState<number | null>(null);

  const missions = [
    {
      icon: Heart,
      title: 'Pembentukan Akhlaq & Fitrah',
      color: 'teal',
      gradient: 'from-teal-500 to-teal-600',
      items: [
        'Menanamkan iman, adab, dan amanah sebagai pondasi sikap kerja',
        'Membiasakan disiplin, kolaborasi, dan layanan bermanfaat',
        'Refleksi berkala melalui jurnal karakter & mentoring'
      ]
    },
    {
      icon: BookOpen,
      title: 'Kurikulum Vokasi Adaptif',
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      items: [
        'Model belajar 80/20 berbasis proyek & magang',
        'Portofolio nyata sebagai bukti kompetensi',
        'Micro-credential relevan dengan industri'
      ]
    },
    {
      icon: Handshake,
      title: 'Kemitraan Industri',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      items: [
        'Kolaborasi proyek dan magang terarah',
        'Showcase karya & career day bersama mitra',
        'Penyaluran ke ekosistem kerja'
      ]
    },
    {
      icon: Cpu,
      title: 'Budaya Data & Teknologi',
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      items: [
        'Literasi digital dan dokumentasi proses',
        'Penggunaan alat modern yang legal & aman',
        'Penguatan keselamatan & kesehatan kerja'
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-700 to-emerald-600 text-white py-32"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:30px_30px]"></div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-20 left-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span className="uppercase tracking-wider text-white/90 text-xs font-bold">Profil Sekolah</span>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            Visi & Misi
            <br />
            <span className="text-6xl bg-gradient-to-r from-emerald-300 to-white bg-clip-text text-transparent">
              SMK Mustaqbal
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/95 text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Menyatukan{' '}
            <span className="inline-flex items-center gap-1 font-bold text-emerald-300 bg-emerald-400/20 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" />fitrah
            </span>
            ,{' '}
            <span className="inline-flex items-center gap-1 font-bold text-emerald-300 bg-emerald-400/20 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" />vokasi
            </span>
            , dan{' '}
            <span className="inline-flex items-center gap-1 font-bold text-emerald-300 bg-emerald-400/20 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" />teknologi
            </span>{' '}
            untuk melahirkan generasi berakhlaq, kompeten, dan siap berkarya.
          </motion.p>
        </div>
      </motion.div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-teal-600/10 px-4 py-2 rounded-full mb-4">
              <Target className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-bold text-teal-600">Visi Kami</span>
            </div>
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Masa Depan yang Kami Cita-citakan
            </h2>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-white to-teal-50/30 rounded-3xl shadow-2xl p-12 border border-teal-100 max-w-5xl mx-auto relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="flex items-start gap-6 mb-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                >
                  <Eye className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-relaxed">
                  "Menjadi SMK yang memuliakan fitrah, unggul dalam vokasi, dan adaptif teknologi—melahirkan lulusan berakhlaq, mandiri, dan berdampak."
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Heart, title: 'Memuliakan Fitrah', desc: 'Mengembangkan potensi diri sesuai nilai spiritual dan karakter', color: 'teal' },
                  { icon: Wrench, title: 'Unggul Vokasi', desc: 'Menguasai keahlian praktis relevan dengan industri', color: 'emerald' },
                  { icon: Cpu, title: 'Adaptif Teknologi', desc: 'Mengikuti perkembangan teknologi dalam karya', color: 'blue' }
                ].map((pillar, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`flex flex-col items-start gap-3 p-6 bg-gradient-to-br from-${pillar.color}-500/5 to-${pillar.color}-600/10 rounded-2xl border border-${pillar.color}-200/50 hover:shadow-lg transition-all`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br from-${pillar.color}-500 to-${pillar.color}-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <pillar.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-${pillar.color}-700 mb-2 text-lg`}>{pillar.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-slate-50 to-teal-50/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full mb-4">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-600">Misi Kami</span>
            </div>
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Langkah Nyata Mewujudkan Visi
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Empat pilar utama yang menjadi landasan implementasi visi kami
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {missions.map((mission, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setHoveredMission(index)}
                onHoverEnd={() => setHoveredMission(null)}
                className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl p-8 border-2 transition-all duration-300 cursor-pointer ${
                  hoveredMission === index ? `border-${mission.color}-400` : 'border-slate-100'
                }`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    animate={{
                      rotate: hoveredMission === index ? 360 : 0,
                      scale: hoveredMission === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 bg-gradient-to-br ${mission.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                  >
                    <mission.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className={`text-xl font-black text-${mission.color}-600 mb-2`}>
                      {mission.title}
                    </h3>
                    <div className={`h-1 w-12 bg-gradient-to-r ${mission.gradient} rounded-full`}></div>
                  </div>
                </div>

                <ul className="space-y-4">
                  {mission.items.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + idx * 0.1 }}
                      className="flex items-start gap-3 group"
                    >
                      <CheckCircle className={`w-5 h-5 text-${mission.color}-600 flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110`} />
                      <span className="text-slate-700 leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-teal-900 via-teal-700 to-emerald-600 text-white py-20 overflow-hidden"
      >
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-12 h-12 text-emerald-300 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Bergabung dengan SMK Mustaqbal?
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Wujudkan potensi terbaikmu bersama kami dalam lingkungan yang mendukung pertumbuhan spiritual, akademik, dan profesional.
            </p>
            <Link href="/ppdb">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 py-5 rounded-2xl font-bold shadow-2xl transition-all"
              >
                Daftar Sekarang
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
