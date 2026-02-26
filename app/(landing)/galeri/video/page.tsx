'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, type GalleryItem } from '@/lib/supabase';
import { Play } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function GaleriVideoPage() {
  const [videos, setVideos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .eq('media_type', 'video')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">Galeri Video</h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Dokumentasi video kegiatan dan profil SMK Mustaqbal
          </p>
        </motion.div>

        {videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">Belum ada video tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => {
              const youtubeId = getYouTubeId(video.media_url);
              const thumbnail =
                video.thumbnail_url || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : 'https://via.placeholder.com/640x360');

              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedVideo(video)}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-200">
                    <img src={thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-teal-600 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-slate-600 text-sm line-clamp-2">{video.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          {selectedVideo && (
            <div>
              <div className="aspect-video">
                {getYouTubeId(selectedVideo.media_url) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.media_url)}`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                ) : (
                  <video controls className="w-full h-full rounded-lg">
                    <source src={selectedVideo.media_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">
                  {selectedVideo.title}
                </h3>
                {selectedVideo.description && (
                  <p className="text-slate-600">{selectedVideo.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
