'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase, type EBrochureDownload } from '@/lib/supabase';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase';

interface HeroSettings {
  slides: Array<{ id: number; image_url: string; order: number }>;
  slider_duration: number;
  overlay_color: string;
  overlay_opacity: number;
  show_indicators: boolean;
  auto_play: boolean;
}

const defaultHeroImages = [
  'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/5212653/pexels-photo-5212653.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/8500373/pexels-photo-8500373.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp: '',
    origin_school: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const [heroImages, setHeroImages] = useState<string[]>(defaultHeroImages);

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  async function fetchHeroSettings() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'hero_settings')
        .maybeSingle();

      if (data && data.value) {
        const settings = data.value as HeroSettings;
        setHeroSettings(settings);
        setHeroImages(settings.slides.map(s => s.image_url));
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
    }
  }

  useEffect(() => {
    const duration = heroSettings?.slider_duration || 5000;
    const autoPlay = heroSettings?.auto_play !== false;

    if (autoPlay) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, duration);
      return () => clearInterval(interval);
    }
  }, [heroImages.length, heroSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const downloadData: EBrochureDownload = {
        ...formData,
      };

      const { error } = await supabase.from('ebrochure_downloads').insert([downloadData]);

      if (error) throw error;

      toast.success('Terima kasih! E-Brosur akan segera dikirim ke WhatsApp Anda.');
      setFormData({ full_name: '', whatsapp: '', origin_school: '' });
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.1,
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut"
            }}
            className="absolute inset-0"
          >
            <motion.img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              animate={{
                scale: currentSlide === index ? 1.05 : 1
              }}
              transition={{
                duration: 5,
                ease: "linear"
              }}
            />
          </motion.div>
        ))}
        <div
          className="absolute inset-0 mix-blend-multiply z-10"
          style={{
            backgroundColor: heroSettings?.overlay_color || '#0d9488',
            opacity: heroSettings?.overlay_opacity || 0.9,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/20 z-10"></div>

        {(heroSettings?.show_indicators !== false) && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left text-white space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 backdrop-blur-sm text-teal-100 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Penerimaan Siswa Baru Telah Dibuka
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Langkah Awal Menuju{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white">
                Masa Depan Hebat
              </span>
            </h1>

            <p className="text-lg text-slate-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed opacity-90">
              Bangun karir impianmu bersama SMK Mustaqbal. Kurikulum berbasis industri, fasilitas modern, dan
              jaminan penyaluran kerja ke perusahaan ternama.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="px-8 py-6 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:-translate-y-1"
              >
                Daftar Sekarang <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-xl transition-all"
              >
                <Download className="mr-2 w-5 h-5" /> Unduh Kurikulum
              </Button>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-teal-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                <span>Terakreditasi A</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                <span>Guru Bersertifikat</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md lg:w-[420px]"
          >
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-amber-500"></div>

              <h3 className="text-2xl font-heading font-bold text-slate-800 mb-2">Download E-Brosur</h3>
              <p className="text-slate-500 text-sm mb-6">
                Isi data diri Anda untuk mendapatkan informasi lengkap mengenai biaya dan kurikulum.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="mt-1"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>

                <div>
                  <Label htmlFor="wa">No. WhatsApp</Label>
                  <Input
                    id="wa"
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="mt-1"
                    placeholder="0812xxxx"
                  />
                </div>

                <div>
                  <Label htmlFor="school">Asal Sekolah</Label>
                  <Input
                    id="school"
                    type="text"
                    required
                    value={formData.origin_school}
                    onChange={(e) => setFormData({ ...formData, origin_school: e.target.value })}
                    className="mt-1"
                    placeholder="Contoh: SMP N 1 Bekasi"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-lg shadow-teal-600/30 transition-all transform active:scale-[0.98] mt-2"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim & Download PDF'}
                </Button>
              </form>

              <p className="text-xs text-slate-400 text-center mt-4">
                Data Anda aman dan tidak akan disebarluaskan.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
