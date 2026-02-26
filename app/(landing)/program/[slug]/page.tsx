import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 60;

export async function generateStaticParams() {
  const { data: programs } = await supabase.from('programs').select('slug').eq('is_active', true);

  return programs?.map((program) => ({
    slug: program.slug,
  })) || [];
}

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .maybeSingle();

  if (!program) {
    notFound();
  }

  return (
    <div className="pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <Link href="/program">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Kembali ke Daftar Program
          </Button>
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="h-96 overflow-hidden relative bg-gradient-to-br from-teal-400 to-teal-600">
            {program.image_url && (
              <img src={program.image_url} alt={program.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{program.title}</h1>
              <p className="text-xl opacity-90">{program.description}</p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">Fasilitas</h2>
                <ul className="space-y-3">
                  {program.facilities?.map((facility: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{facility}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">Prospek Karir</h2>
                <ul className="space-y-3">
                  {program.career_prospects?.map((career: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{career}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-teal-50 rounded-xl p-8 text-center">
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4">
                Tertarik dengan Program Ini?
              </h3>
              <p className="text-slate-600 mb-6">
                Daftar sekarang dan mulai perjalanan karirmu bersama SMK Mustaqbal
              </p>
              <Link href="/ppdb">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6">
                  Daftar PPDB Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
