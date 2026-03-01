import { Quote } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export const revalidate = 0;

const defaultSambutan = {
  nama_kepsek: 'Drs. Ahmad Yani, M.Pd',
  jabatan: 'Kepala Sekolah SMK Mustaqbal',
  foto_url: 'https://i.pravatar.cc/300?img=12',
  sambutan_text: `Assalamu'alaikum Warahmatullahi Wabarakatuh,

Puji syukur kita panjatkan kehadirat Allah SWT yang telah melimpahkan rahmat dan karunia-Nya, sehingga kita semua dapat melaksanakan tugas dan tanggung jawab dalam dunia pendidikan dengan sebaik-baiknya.

SMK Mustaqbal sebagai lembaga pendidikan kejuruan memiliki komitmen kuat untuk mencetak generasi muda yang tidak hanya unggul dalam bidang akademik, tetapi juga memiliki karakter yang kuat, keterampilan teknis yang mumpuni, dan siap bersaing di era industri 4.0.

Kami percaya bahwa pendidikan kejuruan bukan hanya tentang transfer pengetahuan, tetapi juga tentang membangun karakter, mengembangkan soft skills, dan mempersiapkan siswa untuk menghadapi tantangan dunia kerja yang sesungguhnya.

Dengan dukungan tenaga pengajar yang bersertifikat dan berpengalaman, fasilitas laboratorium yang modern, serta kerjasama dengan lebih dari 50 perusahaan ternama, kami yakin dapat memberikan pendidikan terbaik bagi putra-putri Indonesia.

Wassalamu'alaikum Warahmatullahi Wabarakatuh`,
};

async function getSambutanSettings() {
  const supabase = createClient();
  const { data } = await supabase
    .from('page_settings')
    .select('content')
    .eq('page_name', 'tentang-kami')
    .maybeSingle();
  return (data?.content as any)?.sambutan || null;
}

export default async function SambutanKepsekPage() {
  const cmsData = await getSambutanSettings();
  const s = { ...defaultSambutan, ...cmsData };

  const paragraphs = s.sambutan_text.split('\n').filter((p: string) => p.trim());

  return (
    <div className="pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Sambutan Kepala Sekolah
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-2 bg-gradient-to-br from-teal-600 to-teal-700 p-12 flex flex-col justify-center items-center text-white text-center">
              <div className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm mb-6 overflow-hidden border-4 border-white/30">
                <img
                  src={s.foto_url || 'https://i.pravatar.cc/300?img=12'}
                  alt="Kepala Sekolah"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-heading text-2xl font-bold mb-2">{s.nama_kepsek}</h2>
              <p className="text-teal-100 text-sm mb-4">{s.jabatan}</p>
              <div className="text-xs text-teal-200">
                Periode 2020 - Sekarang
              </div>
            </div>

            <div className="md:col-span-3 p-8 md:p-12">
              <Quote className="w-12 h-12 text-teal-600/20 mb-6" />

              <div className="prose prose-slate max-w-none">
                {paragraphs.map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className={`text-slate-700 leading-relaxed mb-6 ${index === 0 || index === paragraphs.length - 1 ? 'font-bold' : ''
                      }`}
                  >
                    {paragraph}
                  </p>
                ))}

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="font-bold text-slate-900">{s.nama_kepsek}</p>
                  <p className="text-sm text-slate-600">{s.jabatan}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">15+</div>
            <p className="text-slate-600">Tahun Pengalaman</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">1000+</div>
            <p className="text-slate-600">Siswa Lulus</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">50+</div>
            <p className="text-slate-600">Mitra Industri</p>
          </div>
        </div>
      </div>
    </div>
  );
}
