'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Newspaper,
  GraduationCap,
  Users,
  Images,
  FileText,
  Settings,
  LogOut,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Home,
  Info,
  Star,
  Handshake,
  MessageSquare,
  MessageCircle,
  Phone,
  ClipboardList,
  BookOpen,
  Rocket,
  Inbox,
  ImageIcon,
  School,
  Palette,
  Globe,
  FootprintsIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth/auth-helpers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// ============================================================
// TIPE DATA SIDEBAR
// ============================================================
interface MenuItem {
  title: string;
  href?: string;
  icon?: any;
  children?: MenuItem[];
}

interface SidebarGroup {
  /** Label grup (huruf kapital) — null berarti tanpa label (misal Dashboard) */
  groupLabel: string | null;
  items: MenuItem[];
}

// ============================================================
// STRUKTUR FINAL SIDEBAR CMS — "Page-Centric & Master Data"
// ============================================================
const sidebarConfig: SidebarGroup[] = [
  // ── Dashboard (Menu Tunggal, tanpa group label) ──
  {
    groupLabel: null,
    items: [
      {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },

  // ── MANAJEMEN HALAMAN ──
  // Fokus pada Update/Edit Teks & Layout halaman website
  {
    groupLabel: 'MANAJEMEN HALAMAN',
    items: [
      // 🏠 Beranda — sub-menu untuk setiap section di landing page
      {
        title: 'Beranda',
        icon: Home,
        children: [
          { title: 'Hero & Download E-Brosur', href: '/admin/pages/beranda?tab=hero', icon: Star },
          { title: 'Keunggulan & Fasilitas', href: '/admin/pages/beranda?tab=features', icon: Star },
          { title: 'Preview Program Keahlian', href: '/admin/pages/beranda?tab=programs', icon: GraduationCap },
          { title: 'Kerjasama Industri & Statistik', href: '/admin/pages/beranda?tab=partners', icon: Handshake },
          { title: 'Kisah Sukses (Testimoni)', href: '/admin/pages/beranda?tab=testimonials', icon: MessageSquare },
          { title: 'Konsultasi WA', href: '/admin/pages/beranda?tab=whatsapp', icon: MessageCircle },
        ],
      },
      // ℹ️ Tentang Kami
      {
        title: 'Tentang Kami',
        icon: Info,
        children: [
          { title: 'Profil, Video & Visi Misi', href: '/admin/pages/tentang-kami?tab=profil', icon: Info },
          { title: 'Sambutan Kepala Sekolah', href: '/admin/pages/tentang-kami?tab=sambutan', icon: Users },
          { title: 'Layout Profil Guru', href: '/admin/pages/tentang-kami?tab=guru-layout', icon: Users },
        ],
      },
      // 🎓 Program Keahlian
      {
        title: 'Program Keahlian',
        icon: GraduationCap,
        children: [
          { title: 'Layout Header', href: '/admin/pages/program-keahlian?tab=header', icon: FileText },
          { title: 'Fasilitas & Prospek Karir', href: '/admin/pages/program-keahlian?tab=fasilitas', icon: Briefcase },
        ],
      },
      // 💼 Portfolio
      {
        title: 'Portfolio',
        icon: Briefcase,
        children: [
          { title: 'Layout Halaman Portfolio', href: '/admin/pages/portfolio', icon: FileText },
        ],
      },
      // 📰 Berita & Artikel
      {
        title: 'Berita & Artikel',
        icon: Newspaper,
        children: [
          { title: 'Layout Header & Filter Tab', href: '/admin/pages/berita', icon: FileText },
        ],
      },
      // 📞 Hubungi Kami
      {
        title: 'Hubungi Kami',
        icon: Phone,
        children: [
          { title: 'Informasi Kontak & Peta', href: '/admin/pages/hubungi-kami', icon: Phone },
        ],
      },
      // 📝 Pendaftaran PPDB
      {
        title: 'Pendaftaran PPDB',
        icon: ClipboardList,
        children: [
          { title: 'Layout Form Pendaftaran', href: '/admin/pages/ppdb', icon: FileText },
        ],
      },
    ],
  },

  // ── MASTER DATA ──
  // Fokus pada CRUD Dinamis (Tambah/Edit/Hapus)
  {
    groupLabel: 'MASTER DATA',
    items: [
      { title: 'Data Guru & Staff', href: '/admin/master/guru', icon: Users },
      { title: 'Data Program Keahlian', href: '/admin/master/program', icon: BookOpen },
      { title: 'Data Portfolio Siswa', href: '/admin/master/portfolio', icon: Rocket },
      { title: 'Data Berita & Pengumuman', href: '/admin/master/berita', icon: Newspaper },
      { title: 'Data Testimoni Alumni', href: '/admin/master/testimoni', icon: MessageSquare },
      { title: 'Data Pendaftar PPDB', href: '/admin/master/ppdb', icon: Inbox },
      { title: 'Media & Galeri', href: '/admin/master/media', icon: Images },
    ],
  },

  // ── PENGATURAN GLOBAL ──
  // Fokus pada Update Pengaturan Situs
  {
    groupLabel: 'PENGATURAN GLOBAL',
    items: [
      { title: 'Informasi Umum Sekolah', href: '/admin/pengaturan/informasi-umum', icon: School },
      { title: 'Branding & Logo', href: '/admin/pengaturan/branding', icon: Palette },
      { title: 'Social Media', href: '/admin/pengaturan/social-media', icon: Globe },
      { title: 'Footer Link & Hak Cipta', href: '/admin/pengaturan/footer', icon: FootprintsIcon },
    ],
  },
];

// ============================================================
// KOMPONEN SIDEBAR
// ============================================================
export function AdminSidebar({ className, user }: { className?: string; user?: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openGroups, setOpenGroups] = useState<string[]>(['Beranda', 'Tentang Kami']);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleGroup = (title: string) => {
    setOpenGroups(prev =>
      prev.includes(title)
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  /** Render satu menu item (bisa punya children / sub-menu) */
  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openGroups.includes(item.title);

    // Cek apakah link aktif (tanpa query-string match supaya path-based)
    const hrefPath = item.href?.split('?')[0];
    const isActive = hrefPath && (pathname === hrefPath || pathname?.startsWith(hrefPath + '/'));

    if (hasChildren) {
      return (
        <div key={item.title} className="space-y-1">
          <button
            onClick={() => toggleGroup(item.title)}
            className={cn(
              'flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-teal-50 hover:text-teal-900 text-gray-700',
              depth > 0 && 'text-xs'
            )}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon className={cn('h-5 w-5', depth > 0 && 'h-4 w-4')} />}
              {item.title}
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isOpen && (
            <div className="ml-4 space-y-0.5 border-l-2 border-teal-100 pl-2">
              {item.children?.map(child => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href || item.title}
        href={item.href!}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-teal-50 hover:text-teal-900',
          isActive
            ? 'bg-teal-100 text-teal-900'
            : 'text-gray-600',
          depth > 0 && 'text-xs py-1.5'
        )}
      >
        {Icon && <Icon className={cn('h-4 w-4', depth === 0 && 'h-5 w-5')} />}
        <span className="truncate">{item.title}</span>
      </Link>
    );
  };

  return (
    <div className={cn('pb-12 min-h-screen flex flex-col', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {/* ── Header ── */}
          <div className="mb-6 px-4">
            <h2 className="text-2xl font-bold text-teal-600 flex items-center gap-2">
              <GraduationCap className="w-8 h-8" />
              Admin CMS
            </h2>
            <p className="text-sm text-gray-500 mt-1">SMK Mustaqbal</p>
          </div>

          {/* ── User Info ── */}
          {user && (
            <div className="mb-6 px-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {(user.adminUser?.full_name || user.user?.email || 'A')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.adminUser?.full_name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize truncate">
                    {user.adminUser?.role || 'administrator'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Menu Items with Group Labels ── */}
          <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {sidebarConfig.map((group, groupIdx) => (
              <div key={group.groupLabel || `group-${groupIdx}`}>
                {/* Group Label Separator */}
                {group.groupLabel && (
                  <div className="mt-5 mb-2 px-3">
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      {group.groupLabel}
                    </p>
                    <div className="mt-1 border-b border-gray-100" />
                  </div>
                )}
                {/* Group Items */}
                <div className="space-y-0.5">
                  {group.items.map(item => renderMenuItem(item))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Logout Button ── */}
      <div className="px-3 py-2 mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
