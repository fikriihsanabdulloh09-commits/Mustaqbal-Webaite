import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t-4 border-teal-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xl">
                SM
              </div>
              <span className="font-heading font-bold text-2xl text-white">SMK Mustaqbal</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Membentuk generasi yang cerdas, berkarakter, dan siap menghadapi tantangan masa depan melalui
              pendidikan vokasi berkualitas tinggi.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors"
              >
                <Facebook className="w-[18px] h-[18px]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors"
              >
                <Instagram className="w-[18px] h-[18px]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors"
              >
                <Twitter className="w-[18px] h-[18px]" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
              >
                <Youtube className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white text-lg mb-6">Tautan Cepat</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/program" className="hover:text-teal-400 transition-colors">
                  Program Keahlian
                </Link>
              </li>
              <li>
                <Link href="/galeri/foto" className="hover:text-teal-400 transition-colors">
                  Galeri Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-teal-400 transition-colors">
                  Berita & Artikel
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-teal-400 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white text-lg mb-6">Layanan</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/ppdb" className="hover:text-teal-400 transition-colors">
                  Pendaftaran Online (PPDB)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-teal-400 transition-colors">
                  Portal Alumni
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-teal-400 transition-colors">
                  E-Learning System
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-teal-400 transition-colors">
                  Bursa Kerja Khusus (BKK)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-teal-400 transition-colors">
                  Cek Kelulusan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white text-lg mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>Jl. Raya Mustaqbal No. 1, Jatiasih, Kota Bekasi, Jawa Barat 17425</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-500 shrink-0" />
                <span>(021) 8243 5555</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-500 shrink-0" />
                <span>info@smkmustaqbal.sch.id</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {currentYear} SMK Mustaqbal. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
