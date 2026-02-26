'use client';

import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, User } from 'lucide-react';

const portfolioItems = [
  {
    id: 1,
    title: 'Sistem Monitoring IoT Industri',
    student: 'Ahmad Rizki',
    program: 'Teknik Otomasi & Robotik',
    year: '2023',
    image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sistem monitoring suhu dan kelembaban industri berbasis IoT dengan notifikasi real-time',
    category: 'Teknik',
  },
  {
    id: 2,
    title: 'Desain Produk Furnitur Modular',
    student: 'Siti Nur Haliza',
    program: 'Product Design & 3D',
    year: '2023',
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Desain furnitur modular yang dapat disesuaikan dengan berbagai kebutuhan ruangan',
    category: 'Design',
  },
  {
    id: 3,
    title: 'Website E-Commerce Modern',
    student: 'Budi Santoso',
    program: 'Web Dev & Digital Marketing',
    year: '2023',
    image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Platform e-commerce dengan fitur payment gateway dan sistem tracking pengiriman',
    category: 'Web Development',
  },
  {
    id: 4,
    title: 'Network Infrastructure Design',
    student: 'Dewi Lestari',
    program: 'IT Support & Network',
    year: '2023',
    image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Perancangan infrastruktur jaringan untuk gedung perkantoran 5 lantai',
    category: 'Networking',
  },
  {
    id: 5,
    title: 'Mobile App Pembelajaran',
    student: 'Eko Prasetyo',
    program: 'Web Dev & Digital Marketing',
    year: '2023',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Aplikasi mobile pembelajaran interaktif dengan gamifikasi',
    category: 'Mobile Development',
  },
  {
    id: 6,
    title: 'Robot Line Follower Advanced',
    student: 'Fajar Ramadhan',
    program: 'Teknik Otomasi & Robotik',
    year: '2023',
    image: 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Robot line follower dengan sensor ultrasonik dan algoritma PID controller',
    category: 'Robotik',
  },
];

export default function PortfolioPage() {
  return (
    <div className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-teal-100 px-4 py-2 rounded-full mb-4">
            <Award className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-bold text-teal-600">Karya Siswa</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Portfolio Siswa SMK Mustaqbal
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Kumpulan karya terbaik siswa kami yang menunjukkan kompetensi dan kreativitas dalam berbagai
            bidang keahlian
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-teal-500 text-white text-xs font-semibold rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <User className="w-4 h-4" />
                    <span>{item.student}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{item.year}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button className="flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors">
                    <span>Lihat Detail</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Punya Karya yang Ingin Dipamerkan?
          </h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Siswa SMK Mustaqbal yang memiliki karya unggulan dapat mengirimkan portfolio untuk ditampilkan di
            halaman ini
          </p>
          <button className="px-8 py-4 bg-white text-teal-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-lg">
            Submit Portfolio Anda
          </button>
        </motion.div>
      </div>
    </div>
  );
}
