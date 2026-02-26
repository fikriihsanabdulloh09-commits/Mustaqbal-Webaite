'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('6281234567890');
  const [defaultMessage, setDefaultMessage] = useState('Halo, saya ingin konsultasi gratis tentang SMK Mustaqbal');

  useEffect(() => {
    fetchWhatsAppSettings();
  }, []);

  async function fetchWhatsAppSettings() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'contact_info')
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        const contactInfo = data.value as any;
        if (contactInfo.whatsapp) {
          setWhatsappNumber(contactInfo.whatsapp);
        }
      }
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
    }
  }

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-80"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Konsultasi Gratis</h3>
                <p className="text-xs text-slate-500">Tim kami siap membantu</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Punya pertanyaan tentang program, biaya, atau pendaftaran? Chat dengan kami sekarang!
            </p>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
            >
              <MessageCircle className="w-5 h-5" />
              Chat WhatsApp
            </button>

            <p className="text-xs text-center text-slate-400 mt-3">
              Biasanya membalas dalam beberapa menit
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl shadow-green-500/40 flex items-center justify-center transition-all"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
      </motion.button>
    </>
  );
}
