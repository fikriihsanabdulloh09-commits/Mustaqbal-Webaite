'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Phone, Award, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Teacher {
  id: string;
  full_name: string;
  nip: string | null;
  position: string;
  subject: string | null;
  photo_url: string | null;
  education: string | null;
  certifications: string[] | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  order_position: number;
}

export default function ProfileGuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const { data, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('is_active', true)
          .order('order_position');

        if (error) throw error;
        setTeachers(data || []);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Memuat data guru...</p>
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
          <div className="inline-flex items-center gap-2 bg-teal-100 px-4 py-2 rounded-full mb-4">
            <GraduationCap className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-bold text-teal-600">Tenaga Pendidik</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Profile Guru SMK Mustaqbal
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Tim pengajar profesional dan bersertifikat yang siap membimbing siswa menuju kesuksesan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-teal-100 to-slate-100">
                {teacher.photo_url ? (
                  <img
                    src={teacher.photo_url}
                    alt={teacher.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-teal-600 flex items-center justify-center text-white text-4xl font-bold">
                      {teacher.full_name.charAt(0)}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="font-heading text-xl font-bold text-white mb-1">{teacher.full_name}</h3>
                  <p className="text-teal-300 text-sm font-medium">{teacher.position}</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {teacher.subject && (
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Keahlian</p>
                      <p className="text-sm font-semibold text-slate-800">{teacher.subject}</p>
                    </div>
                  </div>
                )}

                {teacher.education && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Pendidikan</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{teacher.education}</p>
                    </div>
                  </div>
                )}

                {teacher.certifications && teacher.certifications.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Sertifikasi</p>
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.certifications.slice(0, 3).map((cert, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full font-medium"
                          >
                            {cert}
                          </span>
                        ))}
                        {teacher.certifications.length > 3 && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                            +{teacher.certifications.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {teacher.bio && (
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{teacher.bio}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {teacher.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-teal-600" />
                      <a href={`mailto:${teacher.email}`} className="hover:text-teal-600 transition-colors">
                        {teacher.email}
                      </a>
                    </div>
                  )}
                  {teacher.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-teal-600" />
                      <a href={`tel:${teacher.phone}`} className="hover:text-teal-600 transition-colors">
                        {teacher.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Bergabung dengan Tim Pendidik Kami
          </h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            SMK Mustaqbal membuka kesempatan bagi tenaga pendidik berkualitas untuk bergabung memajukan pendidikan
            vokasi di Indonesia
          </p>
          <button className="px-8 py-4 bg-white text-teal-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-lg">
            Kirim Lamaran
          </button>
        </motion.div>
      </div>
    </div>
  );
}
