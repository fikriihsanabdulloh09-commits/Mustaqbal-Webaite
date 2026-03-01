'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { Menu, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';

// DUMMY DATA - Navigation Menu (dari CMS)
const navigationData = [
  {
    id: '1',
    label: 'Beranda',
    url: '/',
    icon: 'Home',
    has_dropdown: false,
    submenu: [],
    is_active: true,
  },
  {
    id: '2',
    label: 'Tentang Kami',
    url: '#',
    icon: 'Info',
    has_dropdown: true,
    submenu: [
      { id: '2-1', label: 'Visi dan Misi', url: '/tentang/visi-misi' },
      { id: '2-2', label: 'Sambutan Kepala Sekolah', url: '/tentang/sambutan-kepala-sekolah' },
      { id: '2-3', label: 'Profile Guru', url: '/tentang/profile-guru' },
    ],
    is_active: true,
  },
  {
    id: '3',
    label: 'Program Keahlian',
    url: '/program',
    icon: 'GraduationCap',
    has_dropdown: true,
    submenu: [
      { id: '3-1', label: 'Teknik Otomasi & Robotik', url: '/program/teknik-otomasi-robotik' },
      { id: '3-2', label: 'Product Design & 3D', url: '/program/product-design-3d' },
      { id: '3-3', label: 'IT Support & Network', url: '/program/it-support-network' },
      { id: '3-4', label: 'Web Dev & Digital Marketing', url: '/program/web-dev-digital-marketing' },
    ],
    is_active: true,
  },
  {
    id: '4',
    label: 'Galeri',
    url: '#',
    icon: 'Images',
    has_dropdown: true,
    submenu: [
      { id: '4-1', label: 'Galeri Foto', url: '/galeri/foto' },
      { id: '4-2', label: 'Galeri Video', url: '/galeri/video' },
    ],
    is_active: true,
  },
  {
    id: '5',
    label: 'Portfolio',
    url: '/portfolio',
    icon: 'Award',
    has_dropdown: false,
    submenu: [],
    is_active: true,
  },
  {
    id: '6',
    label: 'Berita',
    url: '/berita',
    icon: 'Newspaper',
    has_dropdown: false,
    submenu: [],
    is_active: true,
  },
  {
    id: '7',
    label: 'Hubungi Kami',
    url: '/kontak',
    icon: 'Phone',
    has_dropdown: false,
    submenu: [],
    is_active: true,
  },
];

// Helper function to get icon component dynamically
function getIconComponent(iconName: string) {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Circle;
}

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Filter active navigation items
  const activeNavigation = navigationData.filter(item => item.is_active);

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

  // Lock Body Scroll ketika mobile menu terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const isActiveLink = (url: string) => {
    if (url === '/') {
      return pathname === url;
    }
    // Check if current path starts with menu url or any submenu url
    if (pathname.startsWith(url) && url !== '#') {
      return true;
    }
    return false;
  };

  const isSubmenuActive = (submenu: any[]) => {
    return submenu.some(sub => pathname === sub.url);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-lg py-3'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group relative z-50">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="SMK Mustaqbal Logo"
                width={48}
                height={48}
                className="h-12 w-auto object-contain"
                priority
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
              {activeNavigation.map((item) => {
                const IconComponent = getIconComponent(item.icon);
                const isActive = isActiveLink(item.url) || isSubmenuActive(item.submenu);

                return (
                  <li key={item.id} className="relative group">
                    {item.has_dropdown && item.submenu.length > 0 ? (
                      <>
                        <button
                          className={`flex items-center gap-2 text-sm font-medium transition-colors py-2 ${isScrolled
                            ? 'text-slate-700 hover:text-teal-600'
                            : 'text-white/90 hover:text-white'
                            } ${isActive ? (isScrolled ? 'text-teal-600' : 'text-white') : ''}`}
                        >
                          <IconComponent className="w-[18px] h-[18px]" />
                          {item.label}
                          <ChevronDown className="w-[14px] h-[14px] transition-transform duration-300 group-hover:rotate-180" />
                        </button>
                        <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-64">
                          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5 p-1">
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.id}
                                href={subitem.url}
                                className={`block px-4 py-2.5 text-sm hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors ${pathname === subitem.url ? 'bg-teal-50 text-teal-600' : 'text-slate-600'
                                  }`}
                              >
                                {subitem.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors py-2 ${isScrolled
                          ? 'text-slate-700 hover:text-teal-600'
                          : 'text-white/90 hover:text-white'
                          } ${isActive ? (isScrolled ? 'text-teal-600 font-semibold' : 'text-white font-semibold') : ''}`}
                      >
                        <IconComponent className="w-[18px] h-[18px]" />
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
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
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-[72px] bottom-0 left-0 right-0 w-full bg-white z-40 lg:hidden px-4 py-8 overflow-y-auto max-h-[calc(100vh-72px)] shadow-2xl border-t border-slate-100"
          >
            <div className="container mx-auto flex flex-col gap-2">
              {activeNavigation.map((item) => {
                const IconComponent = getIconComponent(item.icon);
                const isActive = isActiveLink(item.url) || isSubmenuActive(item.submenu);

                return (
                  <div key={item.id} className="border-b border-slate-100">
                    {item.has_dropdown && item.submenu.length > 0 ? (
                      <>
                        <button
                          onClick={() => setOpenSubmenu(openSubmenu === item.id ? null : item.id)}
                          className="w-full text-slate-700 font-medium py-4 text-lg flex items-center justify-between"
                        >
                          <span className="flex items-center gap-3">
                            <IconComponent className="w-[18px] h-[18px] text-teal-500" />
                            {item.label}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform ${openSubmenu === item.id ? 'rotate-180' : ''
                              }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openSubmenu === item.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-slate-50 rounded-lg overflow-hidden"
                            >
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.id}
                                  href={subitem.url}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`block px-6 py-3 text-sm hover:bg-slate-100 pl-12 ${pathname === subitem.url
                                    ? 'text-teal-600 bg-teal-50 font-medium'
                                    : 'text-slate-500 hover:text-teal-600'
                                    }`}
                                >
                                  {subitem.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-slate-700 font-medium py-4 block text-lg flex items-center gap-3 ${isActive ? 'text-teal-600' : ''
                          }`}
                      >
                        <IconComponent className="w-[18px] h-[18px] text-teal-500" />
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
