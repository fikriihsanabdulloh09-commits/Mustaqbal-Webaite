'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Star } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  views: number;
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
  created_at: string;
}

export default function BeritaPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  async function fetchArticles() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setArticles(data || []);
      setFilteredArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Gagal memuat data berita');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus berita ini?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Berita berhasil dihapus');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Gagal menghapus berita');
    }
  }

  async function togglePublish(id: string, currentStatus: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('news_articles')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(currentStatus ? 'Berita di-unpublish' : 'Berita dipublikasikan');
      fetchArticles();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('Gagal mengubah status publikasi');
    }
  }

  async function toggleFeatured(id: string, currentStatus: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('news_articles')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(currentStatus ? 'Berita dihapus dari featured' : 'Berita ditambahkan ke featured');
      fetchArticles();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Gagal mengubah status featured');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Berita</h2>
          <p className="text-gray-500 mt-1">
            Kelola artikel berita dan pengumuman
          </p>
        </div>
        <Link href="/admin/berita/tambah">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Berita
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Berita</CardTitle>
              <CardDescription>
                {filteredArticles.length} dari {articles.length} berita
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'Tidak ada berita yang cocok' : 'Belum ada berita'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {article.is_featured && (
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        )}
                        <div>
                          <div className="font-medium">{article.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {article.excerpt}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {article.category || 'Artikel'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {article.is_published ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{article.views || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(article.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.open(`/berita/${article.slug}`, '_blank')}>
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat
                          </DropdownMenuItem>
                          <Link href={`/admin/berita/edit/${article.id}`}>
                            <DropdownMenuItem>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => togglePublish(article.id, article.is_published)}>
                            {article.is_published ? 'Unpublish' : 'Publish'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleFeatured(article.id, article.is_featured)}>
                            <Star className="w-4 h-4 mr-2" />
                            {article.is_featured ? 'Remove Featured' : 'Set Featured'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(article.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
