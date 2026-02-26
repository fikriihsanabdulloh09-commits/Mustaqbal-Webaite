import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Cpu, Palette, Monitor, Code } from 'lucide-react';

const iconMap: Record<string, any> = {
  cpu: Cpu,
  palette: Palette,
  monitor: Monitor,
  code: Code,
};

export const revalidate = 60;

export default async function ProgramsPage() {
  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('is_active', true)
    .order('order_position');

  return (
    <div className="pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">Program Keahlian</h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Pilih program keahlian yang sesuai dengan minat dan bakatmu. Semua program dilengkapi dengan
            kurikulum berbasis industri dan fasilitas modern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs?.map((program) => {
            const Icon = iconMap[program.icon] || Cpu;

            return (
              <Link key={program.id} href={`/program/${program.slug}`}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="h-56 overflow-hidden relative bg-gradient-to-br from-teal-400 to-teal-600">
                    {program.image_url && (
                      <img
                        src={program.image_url}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
                      <Icon className="w-8 h-8 text-teal-600" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-heading text-2xl font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors">
                      {program.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-4">{program.description}</p>
                    <span className="text-teal-600 font-semibold text-sm">
                      Lihat Detail &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
