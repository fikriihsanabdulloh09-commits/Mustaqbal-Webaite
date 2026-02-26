'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, type GalleryItem } from '@/lib/supabase';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function GaleriFotoPage() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .eq('media_type', 'foto')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPhotos(data || []);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, []);

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
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">Galeri Foto</h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Dokumentasi kegiatan dan momen berharga di SMK Mustaqbal
          </p>
        </motion.div>

        {photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">Belum ada foto tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer aspect-square bg-slate-200"
              >
                <img
                  src={photo.media_url || 'https://via.placeholder.com/400'}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg mb-1">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-sm text-white/80 line-clamp-2">{photo.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          {selectedPhoto && (
            <div>
              <img
                src={selectedPhoto.media_url}
                alt={selectedPhoto.title}
                className="w-full rounded-lg"
              />
              <div className="mt-4">
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">
                  {selectedPhoto.title}
                </h3>
                {selectedPhoto.description && (
                  <p className="text-slate-600">{selectedPhoto.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
