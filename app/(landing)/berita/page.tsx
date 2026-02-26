import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const categoryLabels: Record<string, string> = {
  pengumuman: 'Pengumuman',
  prestasi: 'Prestasi',
  kegiatan: 'Kegiatan',
  artikel: 'Artikel',
};

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: { kategori?: string };
}) {
  let query = supabase
    .from('news_articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (searchParams.kategori) {
    query = query.eq('category', searchParams.kategori);
  }

  const { data: articles } = await query;

  return (
    <div className="pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Berita & Artikel
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Ikuti perkembangan terbaru seputar SMK Mustaqbal, prestasi siswa, dan kegiatan sekolah
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          <Link href="/berita">
            <button
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                !searchParams.kategori
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua
            </button>
          </Link>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Link key={key} href={`/berita?kategori=${key}`}>
              <button
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  searchParams.kategori === key
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles?.map((article) => (
            <Link key={article.id} href={`/berita/${article.slug}`}>
              <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative overflow-hidden aspect-video">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600"></div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-teal-700 rounded-full shadow-sm uppercase tracking-wide">
                    {categoryLabels[article.category] || article.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-[14px] h-[14px]" />
                      {format(new Date(article.published_at), 'd MMM yyyy', { locale: id })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-[14px] h-[14px]" />
                      {article.author}
                    </div>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {articles?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">Tidak ada berita untuk kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
