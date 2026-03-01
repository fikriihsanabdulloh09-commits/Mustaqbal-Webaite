import { Layers, Award, Briefcase } from 'lucide-react';

const features = [
  {
    icon: Layers,
    color: 'blue',
    title: 'Pembelajaran 70% Praktik',
    description:
      'Metode pembelajaran hands-on di laboratorium modern memastikan siswa memiliki skill teknis yang kuat sesuai standar industri.',
  },
  {
    icon: Award,
    color: 'teal',
    title: 'Guru Praktisi & Ahli',
    description:
      'Dididik langsung oleh tenaga pengajar bersertifikat dan praktisi industri yang berpengalaman di bidangnya masing-masing.',
  },
  {
    icon: Briefcase,
    color: 'amber',
    title: 'Penyaluran Kerja',
    description:
      'Kerjasama dengan 50+ perusahaan multinasional untuk program magang dan rekrutmen langsung setelah lulus.',
  },
];

interface FeatureSettings {
  section_title?: string;
  section_subtitle?: string;
  items?: Array<{ icon: string; title: string; description: string }>;
}

export default function FeaturesSection({ settings }: { settings?: FeatureSettings }) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div
          className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-slideInUp"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          <h2 className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-3">Kenapa Memilih Kami?</h2>
          <h3 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            {settings?.section_title || 'Keunggulan Akademik & Fasilitas Terbaik'}
          </h3>
          <p className="text-slate-600 text-lg">
            {settings?.section_subtitle || 'Kami tidak hanya mencetak lulusan yang pintar secara teori, tetapi juga terampil, berkarakter, dan siap bersaing di era global.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 opacity-0 animate-slideInUp"
              style={{ animationDelay: `${0.2 + index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-${feature.color}-100 text-${feature.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
              >
                <feature.icon className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-heading font-bold text-slate-800 mb-4">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
