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
  Menu as MenuIcon,
  Settings,
  LogOut,
  UserCheck,
  Award,
  Calendar,
  Bell,
  Mail,
  FolderOpen,
  Palette,
  Wand2,
  Brush,
  Sparkles,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
  Video,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth/auth-helpers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MenuItem {
  title: string;
  href?: string;
  icon: any;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Design & Layout',
    icon: Palette,
    children: [
      {
        title: 'Page Builder',
        href: '/admin/page-builder',
        icon: Wand2,
      },
      {
        title: 'Hero Settings',
        href: '/admin/hero-settings',
        icon: ImageIcon,
      },
      {
        title: 'Themes',
        href: '/admin/themes',
        icon: Palette,
      },
      {
        title: 'Global Styles',
        href: '/admin/styles',
        icon: Brush,
      },
      {
        title: 'Animations',
        href: '/admin/animations',
        icon: Sparkles,
      },
      {
        title: 'Brand & Logo',
        href: '/admin/branding',
        icon: ImageIcon,
      },
    ],
  },
  {
    title: 'Konten',
    icon: FileText,
    children: [
      {
        title: 'Berita',
        href: '/admin/berita',
        icon: Newspaper,
      },
      {
        title: 'Program Keahlian',
        href: '/admin/program',
        icon: GraduationCap,
      },
      {
        title: 'Guru & Staff',
        href: '/admin/guru',
        icon: Users,
      },
      {
        title: 'Prestasi',
        href: '/admin/prestasi',
        icon: Award,
      },
      {
        title: 'Events',
        href: '/admin/events',
        icon: Calendar,
      },
      {
        title: 'Pengumuman',
        href: '/admin/pengumuman',
        icon: Bell,
      },
      {
        title: 'Portfolio',
        href: '/admin/portfolio',
        icon: Briefcase,
      },
    ],
  },
  {
    title: 'Media & Galeri',
    icon: Images,
    children: [
      {
        title: 'Galeri Foto',
        href: '/admin/galeri/foto',
        icon: Images,
      },
      {
        title: 'Galeri Video',
        href: '/admin/galeri/video',
        icon: Video,
      },
      {
        title: 'Kurikulum',
        href: '/admin/dokumen/kurikulum',
        icon: FileText,
      },
      {
        title: 'E-Brosur',
        href: '/admin/dokumen/ebrosur',
        icon: FileText,
      },
    ],
  },
  {
    title: 'PPDB',
    href: '/admin/ppdb',
    icon: UserCheck,
  },
  {
    title: 'Website',
    icon: MenuIcon,
    children: [
      {
        title: 'Halaman',
        href: '/admin/halaman',
        icon: FileText,
      },
      {
        title: 'Menu Navigasi',
        href: '/admin/menu',
        icon: MenuIcon,
      },
      {
        title: 'Newsletter',
        href: '/admin/newsletter',
        icon: Mail,
      },
    ],
  },
  {
    title: 'Pengaturan',
    href: '/admin/pengaturan',
    icon: Settings,
  },
];

export function AdminSidebar({ className, user }: { className?: string; user?: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openGroups, setOpenGroups] = useState<string[]>(['Design & Layout', 'Konten']);

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

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openGroups.includes(item.title);
    const isActive = item.href && (pathname === item.href || pathname?.startsWith(item.href + '/'));

    if (hasChildren) {
      return (
        <div key={item.title} className="space-y-1">
          <button
            onClick={() => toggleGroup(item.title)}
            className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-teal-50 hover:text-teal-900 text-gray-700"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5" />
              {item.title}
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isOpen && (
            <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-2">
              {item.children?.map(child => {
                const ChildIcon = child.icon;
                const isChildActive = child.href && (pathname === child.href || pathname?.startsWith(child.href + '/'));

                return (
                  <Link
                    key={child.href}
                    href={child.href!}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-teal-50 hover:text-teal-900',
                      isChildActive
                        ? 'bg-teal-100 text-teal-900'
                        : 'text-gray-600'
                    )}
                  >
                    <ChildIcon className="h-4 w-4" />
                    {child.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-teal-50 hover:text-teal-900',
          isActive
            ? 'bg-teal-100 text-teal-900'
            : 'text-gray-700'
        )}
      >
        <Icon className="h-5 w-5" />
        {item.title}
      </Link>
    );
  };

  return (
    <div className={cn('pb-12 min-h-screen flex flex-col', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-6 px-4">
            <h2 className="text-2xl font-bold text-teal-600 flex items-center gap-2">
              <GraduationCap className="w-8 h-8" />
              Admin CMS
            </h2>
            <p className="text-sm text-gray-500 mt-1">SMK Mustaqbal</p>
          </div>

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

          <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto">
            {menuItems.map(renderMenuItem)}
          </div>
        </div>
      </div>
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
