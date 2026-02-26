import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KontakPage() {
  return (
    <div className="pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">Hubungi Kami</h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Kami siap membantu menjawab pertanyaan Anda. Hubungi kami melalui berbagai channel yang tersedia
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">Informasi Kontak</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Alamat</h3>
                  <p className="text-slate-600">
                    Jl. Raya Mustaqbal No. 1, Jatiasih,
                    <br />
                    Kota Bekasi, Jawa Barat 17425
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Telepon</h3>
                  <p className="text-slate-600">(021) 8243 5555</p>
                  <p className="text-slate-600">+62 812-3456-7890 (WhatsApp)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                  <p className="text-slate-600">info@smkmustaqbal.sch.id</p>
                  <p className="text-slate-600">ppdb@smkmustaqbal.sch.id</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Jam Operasional</h3>
                  <p className="text-slate-600">Senin - Jumat: 07.00 - 16.00 WIB</p>
                  <p className="text-slate-600">Sabtu: 07.00 - 14.00 WIB</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Ikuti Kami</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8!2d106.9!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNTQnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Kunjungi Sekolah Kami</h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Ingin melihat langsung fasilitas dan suasana belajar di SMK Mustaqbal? Hubungi kami untuk membuat
            janji kunjungan
          </p>
          <Button
            size="lg"
            variant="outline"
            className="bg-white text-teal-700 hover:bg-slate-50 border-0 px-8"
          >
            Buat Janji Kunjungan
          </Button>
        </div>
      </div>
    </div>
  );
}
