import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const revalidate = 60;

const categoryLabels: Record<string, string> = {
  pengumuman: 'Pengumuman',
  prestasi: 'Prestasi',
  kegiatan: 'Kegiatan',
  artikel: 'Artikel',
};

export async function generateStaticParams() {
  const { data: articles } = await supabase
    .from('news_articles')
    .select('slug')
    .eq('is_published', true);

  return articles?.map((article) => ({
    slug: article.slug,
  })) || [];
}

export default async function BeritaDetailPage({ params }: { params: { slug: string } }) {
  const { data: article } = await supabase
    .from('news_articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!article) {
    notFound();
  }

  await supabase
    .from('news_articles')
    .update({ views: article.views + 1 })
    .eq('id', article.id);

  return (
    <div className="pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/berita">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Kembali ke Berita
          </Button>
        </Link>

        <article className="bg-white rounded-2xl overflow-hidden shadow-xl">
          {article.image_url && (
            <div className="h-96 overflow-hidden relative">
              <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-bold uppercase tracking-wide mb-6">
              {categoryLabels[article.category] || article.category}
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(article.published_at), 'd MMMM yyyy', { locale: id })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views + 1} views</span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-heading prose-a:text-teal-600 prose-img:rounded-xl">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </div>
        </article>

        <div className="mt-12 bg-teal-50 rounded-xl p-8 text-center">
          <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4">
            Bergabunglah dengan SMK Mustaqbal
          </h3>
          <p className="text-slate-600 mb-6">Daftar sekarang dan raih masa depan gemilang bersama kami</p>
          <Link href="/ppdb">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6">
              Daftar PPDB Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
