'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Newspaper,
  GraduationCap,
  Users,
  UserCheck,
  Eye,
  TrendingUp,
  Calendar,
  Award,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const BarChartWrapper = dynamic(
  () => import('@/components/admin/ChartComponents').then((mod) => mod.BarChartWrapper),
  { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center text-gray-500">Loading chart...</div> }
);

const PieChartWrapper = dynamic(
  () => import('@/components/admin/ChartComponents').then((mod) => mod.PieChartWrapper),
  { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center text-gray-500">Loading chart...</div> }
);

interface Stats {
  totalNews: number;
  totalPrograms: number;
  totalTeachers: number;
  totalPPDB: number;
  pendingPPDB: number;
  approvedPPDB: number;
  totalViews: number;
  totalTestimonials: number;
  totalGallery: number;
  totalNewsletters: number;
}

interface RecentActivity {
  id: string;
  title: string;
  type: string;
  date: string;
}

const COLORS = ['#0d9488', '#10b981', '#3b82f6', '#f59e0b'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalNews: 0,
    totalPrograms: 0,
    totalTeachers: 0,
    totalPPDB: 0,
    pendingPPDB: 0,
    approvedPPDB: 0,
    totalViews: 0,
    totalTestimonials: 0,
    totalGallery: 0,
    totalNewsletters: 0,
  });
  const [recentNews, setRecentNews] = useState<RecentActivity[]>([]);
  const [recentPPDB, setRecentPPDB] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [viewsData, setViewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const supabase = createClient();

      // Fetch all stats in parallel
      const [
        newsResult,
        programsResult,
        teachersResult,
        ppdbResult,
        ppdbPendingResult,
        ppdbApprovedResult,
        testimonialsResult,
        galleryResult,
        newslettersResult,
        categoriesResult,
      ] = await Promise.all([
        supabase.from('news_articles').select('*', { count: 'exact', head: false }),
        supabase.from('programs').select('*', { count: 'exact', head: true }),
        supabase.from('teachers').select('*', { count: 'exact', head: true }),
        supabase.from('ppdb_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('ppdb_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('ppdb_submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
        supabase.from('newsletters').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('name, slug'),
      ]);

      // Calculate total views from news
      const totalViews = newsResult.data?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;

      setStats({
        totalNews: newsResult.count || 0,
        totalPrograms: programsResult.count || 0,
        totalTeachers: teachersResult.count || 0,
        totalPPDB: ppdbResult.count || 0,
        pendingPPDB: ppdbPendingResult.count || 0,
        approvedPPDB: ppdbApprovedResult.count || 0,
        totalViews,
        totalTestimonials: testimonialsResult.count || 0,
        totalGallery: galleryResult.count || 0,
        totalNewsletters: newslettersResult.count || 0,
      });

      // Recent news
      const recentNewsData = newsResult.data
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(article => ({
          id: article.id,
          title: article.title,
          type: 'Berita',
          date: new Date(article.created_at).toLocaleDateString('id-ID'),
        })) || [];
      setRecentNews(recentNewsData);

      // Recent PPDB
      const { data: ppdbData } = await supabase
        .from('ppdb_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentPPDB(ppdbData || []);

      // Category distribution
      if (categoriesResult.data) {
        const categoryStats = await Promise.all(
          categoriesResult.data.map(async (cat) => {
            const { count } = await supabase
              .from('news_articles')
              .select('*', { count: 'exact', head: true })
              .eq('category', cat.slug);
            return { name: cat.name, value: count || 0 };
          })
        );
        setCategoryData(categoryStats);
      }

      // Views data (mock - in production, use real analytics)
      const mockViewsData = newsResult.data
        ?.sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 10)
        .map(article => ({
          name: article.title.substring(0, 30) + '...',
          views: article.views || 0,
        })) || [];
      setViewsData(mockViewsData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">
          Monitoring website dan statistik pengunjung
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Berita</CardTitle>
            <Newspaper className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNews}</div>
            <p className="text-xs text-gray-500">
              {stats.totalViews.toLocaleString()} total views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program Keahlian</CardTitle>
            <GraduationCap className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrograms}</div>
            <p className="text-xs text-gray-500">Program aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guru & Staff</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-gray-500">Total pengajar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendaftar PPDB</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPPDB}</div>
            <p className="text-xs text-gray-500">
              {stats.pendingPPDB} pending, {stats.approvedPPDB} approved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Dari semua berita</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimoni</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTestimonials}</div>
            <p className="text-xs text-gray-500">Dari alumni</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Galeri</CardTitle>
            <Calendar className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGallery}</div>
            <p className="text-xs text-gray-500">Foto & video</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNewsletters}</div>
            <p className="text-xs text-gray-500">Newsletter</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Berita Terpopuler</CardTitle>
            <CardDescription>Berdasarkan jumlah views</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartWrapper data={viewsData} dataKey="views" fill="#0d9488" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kategori Berita</CardTitle>
            <CardDescription>Berdasarkan jumlah artikel</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartWrapper data={categoryData} colors={COLORS} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Berita Terbaru</CardTitle>
            <CardDescription>5 berita terakhir yang dipublikasikan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNews.length > 0 ? (
                recentNews.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada berita</p>
              )}
            </div>
            <Link href="/admin/berita">
              <Button variant="outline" className="w-full mt-4">
                Lihat Semua Berita
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pendaftar PPDB Terbaru</CardTitle>
            <CardDescription>5 pendaftar terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPPDB.length > 0 ? (
                recentPPDB.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                      <div>
                        <p className="text-sm font-medium">{item.full_name}</p>
                        <p className="text-xs text-gray-500">{item.origin_school}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'approved' ? 'bg-green-100 text-green-700' :
                      item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada pendaftar</p>
              )}
            </div>
            <Link href="/admin/ppdb">
              <Button variant="outline" className="w-full mt-4">
                Lihat Semua Pendaftar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Akses cepat ke fitur yang sering digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/admin/berita/tambah">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                <Newspaper className="w-6 h-6" />
                <span>Tambah Berita</span>
              </Button>
            </Link>
            <Link href="/admin/program/tambah">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                <GraduationCap className="w-6 h-6" />
                <span>Tambah Program</span>
              </Button>
            </Link>
            <Link href="/admin/guru/tambah">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Tambah Guru</span>
              </Button>
            </Link>
            <Link href="/admin/pengaturan">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                <Settings className="w-6 h-6" />
                <span>Pengaturan</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
