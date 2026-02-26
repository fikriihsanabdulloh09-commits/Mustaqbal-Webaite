'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Home, Info, GraduationCap, Images, Newspaper, Phone, ChevronDown, X, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';

const navigation = [
  { name: 'Beranda', href: '/', icon: Home },
  {
    name: 'Tentang Kami',
    href: '#',
    icon: Info,
    submenu: [
      { name: 'Visi dan Misi', href: '/tentang/visi-misi' },
      { name: 'Sambutan Kepala Sekolah', href: '/tentang/sambutan-kepala-sekolah' },
      { name: 'Profile Guru', href: '/tentang/profile-guru' },
    ],
  },
  {
    name: 'Program Keahlian',
    href: '/program',
    icon: GraduationCap,
    submenu: [
      { name: 'Teknik Otomasi & Robotik', href: '/program/teknik-otomasi-robotik' },
      { name: 'Product Design & 3D', href: '/program/product-design-3d' },
      { name: 'IT Support & Network', href: '/program/it-support-network' },
      { name: 'Web Dev & Digital Marketing', href: '/program/web-dev-digital-marketing' },
    ],
  },
  {
    name: 'Galeri',
    href: '#',
    icon: Images,
    submenu: [
      { name: 'Galeri Foto', href: '/galeri/foto' },
      { name: 'Galeri Video', href: '/galeri/video' },
    ],
  },
  { name: 'Portfolio', href: '/portfolio', icon: Award },
  { name: 'Berita', href: '/berita', icon: Newspaper },
  { name: 'Hubungi Kami', href: '/kontak', icon: Phone },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchBranding();
  }, []);

  async function fetchBranding() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('site_branding')
        .select('url')
        .eq('key', 'main_logo')
        .eq('is_active', true)
        .single();

      if (data?.url) {
        setLogoUrl(data.url);
      }
    } catch (error) {
      console.error('Error fetching branding:', error);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-lg py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group relative z-50">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="SMK Mustaqbal Logo"
              className="h-12 w-auto object-contain"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xl">
              SM
            </div>
          )}
          <div className={`flex flex-col transition-colors ${isScrolled ? 'text-slate-800' : 'text-white'}`}>
            <span className="font-heading font-bold text-lg leading-tight tracking-tight">SMK Mustaqbal</span>
            <span className="text-xs font-medium opacity-80">School of Future</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex gap-6 items-center">
            {navigation.map((item) => (
              <li key={item.name} className="relative group">
                {item.submenu && item.submenu.length > 0 ? (
                  <>
                    <button
                      className={`flex items-center gap-2 text-sm font-medium transition-colors py-2 ${isScrolled
                        ? 'text-slate-700 hover:text-teal-600'
                        : 'text-white/90 hover:text-white'
                        } ${isActiveLink(item.href) ? (isScrolled ? 'text-teal-600' : 'text-white') : ''}`}
                    >
                      <item.icon className="w-[18px] h-[18px]" />
                      {item.name}
                      <ChevronDown className="w-[14px] h-[14px] transition-transform duration-300 group-hover:rotate-180" />
                    </button>
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-64">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5 p-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className={`block px-4 py-2.5 text-sm hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors ${isActiveLink(subitem.href) ? 'bg-teal-50 text-teal-600' : 'text-slate-600'
                              }`}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors py-2 ${isScrolled
                      ? 'text-slate-700 hover:text-teal-600'
                      : 'text-white/90 hover:text-white'
                      } ${isActiveLink(item.href) ? (isScrolled ? 'text-teal-600 font-semibold' : 'text-white font-semibold') : ''}`}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/ppdb"
            className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all transform hover:-translate-y-0.5 shadow-lg bg-white text-teal-700 hover:bg-slate-50 hover:shadow-xl active:translate-y-0"
          >
            Daftar PPDB
          </Link>
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 rounded-md transition-colors relative z-50 ${isScrolled ? 'text-slate-800' : 'text-white'
            }`}
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-white z-40 lg:hidden pt-24 px-4 pb-10 overflow-y-auto"
          >
            <div className="container mx-auto flex flex-col gap-2">
              {navigation.map((item) => (
                <div key={item.name} className="border-b border-slate-100">
                  {item.submenu && item.submenu.length > 0 ? (
                    <>
                      <button
                        onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                        className="w-full text-slate-700 font-medium py-4 text-lg flex items-center justify-between"
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="w-[18px] h-[18px] text-teal-500" />
                          {item.name}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                      <AnimatePresence>
                        {openSubmenu === item.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-slate-50 rounded-lg overflow-hidden"
                          >
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.name}
                                href={subitem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-6 py-3 text-sm hover:bg-slate-100 pl-12 ${isActiveLink(subitem.href)
                                  ? 'text-teal-600 bg-teal-50 font-medium'
                                  : 'text-slate-500 hover:text-teal-600'
                                  }`}
                              >
                                {subitem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-slate-700 font-medium py-4 block text-lg flex items-center gap-3 ${isActiveLink(item.href) ? 'text-teal-600' : ''
                        }`}
                    >
                      <item.icon className="w-[18px] h-[18px] text-teal-500" />
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="mt-6">
                <Link
                  href="/ppdb"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 active:scale-95 transition-all shadow-lg shadow-teal-600/20"
                >
                  Daftar PPDB Sekarang
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}