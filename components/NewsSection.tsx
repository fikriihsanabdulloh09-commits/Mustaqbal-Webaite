'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { supabase, type NewsArticle } from '@/lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const categoryLabels: Record<string, string> = {
  pengumuman: 'Pengumuman',
  prestasi: 'Prestasi',
  kegiatan: 'Kegiatan',
  artikel: 'Artikel',
};

export default function NewsSection() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from('news_articles')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setNews(data || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-3">Berita Terkini</h2>
          <h3 className="font-heading text-3xl md:text-4xl font-bold text-slate-900">Seputar SMK Mustaqbal</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="group flex flex-col h-full cursor-pointer"
            >
              <Link href={`/berita/${article.slug}`}>
                <div className="relative overflow-hidden rounded-2xl mb-5 aspect-video shadow-sm">
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
                <h4 className="text-xl font-heading font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
                <span className="inline-block mt-auto text-sm font-semibold text-slate-400 group-hover:text-teal-500 transition-colors">
                  Baca Selengkapnya &rarr;
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
