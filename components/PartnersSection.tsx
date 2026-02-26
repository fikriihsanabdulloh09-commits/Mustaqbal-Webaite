'use client';

import { motion } from 'framer-motion';

const partners = [
  {
    name: 'Bank Mandiri',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png',
    category: 'Perbankan',
  },
  {
    name: 'Bank BNI',
    logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo_2016.svg/2560px-BNI_logo_2016.svg.png',
    category: 'Perbankan',
  },
  {
    name: 'Bank BRI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Logo_BRI.svg/2560px-Logo_BRI.svg.png',
    category: 'Perbankan',
  },
  {
    name: 'Astra',
    logo: 'https://www.astra.co.id/themes/custom/astra/logo.svg',
    category: 'Otomotif',
  },
  {
    name: 'Pertamina',
    logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/e/e3/Logo_PERTAMINA.png/1200px-Logo_PERTAMINA.png',
    category: 'Energi',
  },
  {
    name: 'Telkom Indonesia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Telkom_Indonesia_2013.svg/2560px-Telkom_Indonesia_2013.svg.png',
    category: 'Telekomunikasi',
  },
];

export default function PartnersSection() {
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
            Dipercaya oleh Perusahaan Terkemuka
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Lebih dari 50+ perusahaan bermitra dengan kami untuk program magang, rekrutmen, dan pengembangan
            kurikulum
          </p>
        </motion.div>

        <div className="relative overflow-hidden">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="relative">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-12 md:h-14 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 filter"
                  />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs text-teal-600 font-semibold whitespace-nowrap bg-teal-50 px-2 py-1 rounded">
                      {partner.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-8 px-8 py-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100">
              <div className="text-center">
                <div className="text-3xl font-black text-teal-600">50+</div>
                <div className="text-sm text-slate-600 font-medium">Mitra Industri</div>
              </div>
              <div className="w-px h-12 bg-teal-200"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-600">90%</div>
                <div className="text-sm text-slate-600 font-medium">Siswa Tersalurkan</div>
              </div>
              <div className="w-px h-12 bg-teal-200"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-blue-600">1000+</div>
                <div className="text-sm text-slate-600 font-medium">Alumni Bekerja</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
