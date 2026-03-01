'use client';

import Link from 'next/link';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';
import { MapPin, Phone, Mail } from 'lucide-react';

// DUMMY DATA - Simulasi data dari CMS
const footerData = {
  // Section 1: Branding
  logo_url: '',
  school_name: 'SMK Mustaqbal',
  description: 'Membentuk generasi yang cerdas, berkarakter, dan siap menghadapi tantangan masa depan melalui pendidikan vokasi berkualitas tinggi.',

  // Section 2: Social Media
  social_links: [
    { id: '1', platform: 'Facebook', icon: 'Facebook', url: 'https://facebook.com/smkmustaqbal', color: 'bg-blue-600 hover:bg-blue-700', is_active: true },
    { id: '2', platform: 'Instagram', icon: 'Instagram', url: 'https://instagram.com/smkmustaqbal', color: 'bg-pink-600 hover:bg-pink-700', is_active: true },
    { id: '3', platform: 'Twitter', icon: 'Twitter', url: 'https://twitter.com/smkmustaqbal', color: 'bg-sky-500 hover:bg-sky-600', is_active: true },
    { id: '4', platform: 'Youtube', icon: 'Youtube', url: 'https://youtube.com/smkmustaqbal', color: 'bg-red-600 hover:bg-red-700', is_active: true },
  ],

  // Section 3: Footer Columns (Link Groups)
  columns: [
    {
      id: '1',
      title: 'Tautan Cepat',
      links: [
        { id: '1', label: 'Program Keahlian', url: '/program' },
        { id: '2', label: 'Galeri Kegiatan', url: '/galeri/foto' },
        { id: '3', label: 'Berita & Artikel', url: '/berita' },
        { id: '4', label: 'Hubungi Kami', url: '/kontak' },
      ]
    },
    {
      id: '2',
      title: 'Layanan',
      links: [
        { id: '1', label: 'Pendaftaran Online (PPDB)', url: '/ppdb' },
        { id: '2', label: 'Portal Alumni', url: '/alumni' },
        { id: '3', label: 'E-Learning System', url: '/e-learning' },
        { id: '4', label: 'Bursa Kerja Khusus (BKK)', url: '/bkk' },
      ]
    },
  ],

  // Section 4: Contact Info
  contact: {
    address: 'Jl. Raya Mustaqbal No. 1, Jatiasih, Kota Bekasi, Jawa Barat 17425',
    phone: '(021) 8243 5555',
    email: 'info@smkmustaqbal.sch.id',
  },

  // Section 5: Copyright
  copyright_text: 'SMK Mustaqbal. Hak Cipta Dilindungi.',
};

// Helper function to get icon component dynamically
function getIconComponent(iconName: string) {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Globe;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const data = footerData; // Dalam FASE 2, ini akan diganti dengan fetch dari API

  // Filter active social links
  const activeSocialLinks = data.social_links.filter(link => link.is_active);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t-4 border-teal-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Branding & Social */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {data.logo_url ? (
                <Image
                  src={data.logo_url}
                  alt={data.school_name}
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xl">
                  SM
                </div>
              )}
              <span className="font-heading font-bold text-2xl text-white">
                {data.school_name}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-400">
              {data.description}
            </p>

            {/* Social Links */}
            {activeSocialLinks.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {activeSocialLinks.map((link) => {
                  const IconComponent = getIconComponent(link.icon);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full ${link.color} flex items-center justify-center text-white transition-all hover:scale-110`}
                      title={link.platform}
                    >
                      <IconComponent className="w-[18px] h-[18px]" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Footer Columns */}
          {data.columns.map((column) => (
            <div key={column.id}>
              <h4 className="font-heading font-bold text-white text-lg mb-6">
                {column.title}
              </h4>
              <ul className="space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className="hover:text-teal-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info Column */}
          <div>
            <h4 className="font-heading font-bold text-white text-lg mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm">
              {data.contact.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <span>{data.contact.address}</span>
                </li>
              )}
              {data.contact.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-teal-500 shrink-0" />
                  <span>{data.contact.phone}</span>
                </li>
              )}
              {data.contact.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-teal-500 shrink-0" />
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="hover:text-teal-400 transition-colors"
                  >
                    {data.contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {currentYear} {data.copyright_text}</p>
        </div>
      </div>
    </footer>
  );
}
