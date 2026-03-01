'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, User, Search, Filter, X } from 'lucide-react';
import Image from 'next/image';

// DUMMY DATA - Simulasi data dari CMS + Page Settings
const portfolioSettings = {
  page_title: 'Portfolio Karya Siswa',
  page_subtitle: 'Lihat karya terbaik dari siswa-siswi SMK Mustaqbal di berbagai bidang keahlian.',
  show_filter: true,
  show_search: true,
  categories: ['Semua', 'Teknik', 'Design', 'Web Development', 'Networking', 'Mobile Development', 'Robotik'],
};

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
  // State untuk Filter & Search
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter logic
  const filteredItems = useMemo(() => {
    return portfolioItems.filter((item) => {
      // Filter by category
      const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;

      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchLower) ||
        item.student.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.program.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Stats untuk tampilan
  const resultCount = filteredItems.length;
  const activeFiltersCount = (selectedCategory !== 'Semua' ? 1 : 0) + (searchQuery ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory('Semua');
    setSearchQuery('');
  };

  return (
    <div className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-teal-100 px-4 py-2 rounded-full mb-4">
            <Award className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-bold text-teal-600">Karya Siswa</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {portfolioSettings.page_title}
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            {portfolioSettings.page_subtitle}
          </p>
        </motion.div>

        {/* Filter & Search Section */}
        {(portfolioSettings.show_filter || portfolioSettings.show_search) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search Bar */}
                {portfolioSettings.show_search && (
                  <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari portfolio..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                  </div>
                )}

                {/* Category Filter - Desktop */}
                {portfolioSettings.show_filter && (
                  <div className="hidden lg:flex items-center gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-slate-400 mr-2" />
                    {portfolioSettings.categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                            ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}

                {/* Mobile Filter Toggle */}
                {portfolioSettings.show_filter && (
                  <button
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-slate-600 font-medium"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                    {activeFiltersCount > 0 && (
                      <span className="ml-1 w-5 h-5 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Mobile Filter Dropdown */}
              {isMobileFilterOpen && portfolioSettings.show_filter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mt-4 pt-4 border-t border-slate-200"
                >
                  <p className="text-sm font-medium text-slate-500 mb-3">Kategori:</p>
                  <div className="flex flex-wrap gap-2">
                    {portfolioSettings.categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
                  <span className="text-sm text-slate-500">Filter aktif:</span>
                  {selectedCategory !== 'Semua' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory('Semua')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full">
                      &ldquo;{searchQuery}&rdquo;
                      <button onClick={() => setSearchQuery('')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-500 hover:text-red-600 font-medium ml-auto"
                  >
                    Hapus semua
                  </button>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-slate-500">
              Menampilkan <span className="font-semibold text-slate-700">{resultCount}</span> portfolio
              {selectedCategory !== 'Semua' && (
                <span> dalam kategori <span className="font-medium text-teal-600">&ldquo;{selectedCategory}&rdquo;</span></span>
              )}
            </div>
          </motion.div>
        )}

        {/* Portfolio Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Tidak ada portfolio ditemukan
            </h3>
            <p className="text-slate-500 mb-6">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
            >
              Hapus Filter
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
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
