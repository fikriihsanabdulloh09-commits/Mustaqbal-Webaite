'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase, type Program, type PPDBSubmission } from '@/lib/supabase';
import { toast } from 'sonner';
import { CheckCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
  full_name: z.string().min(3, 'Nama harus minimal 3 karakter'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone: z.string().min(10, 'Nomor telepon tidak valid'),
  whatsapp: z.string().min(10, 'Nomor WhatsApp tidak valid'),
  origin_school: z.string().min(3, 'Asal sekolah harus diisi'),
  chosen_program: z.string().optional(),
  address: z.string().optional(),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function PPDBPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const chosenProgram = watch('chosen_program');

  useEffect(() => {
    async function fetchPrograms() {
      const { data } = await supabase
        .from('programs')
        .select('*')
        .eq('is_active', true)
        .order('order_position');

      if (data) setPrograms(data);
    }
    fetchPrograms();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const submissionData: PPDBSubmission = {
        ...data,
      };

      const { error } = await supabase.from('ppdb_submissions').insert([submissionData]);

      if (error) throw error;

      setIsSuccess(true);
      toast.success('Pendaftaran berhasil! Kami akan menghubungi Anda segera.');
      reset();
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-32 pb-20 bg-slate-50 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center px-4"
        >
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-slate-900 mb-4">
              Pendaftaran Berhasil!
            </h1>
            <p className="text-slate-600 text-lg mb-8">
              Terima kasih telah mendaftar di SMK Mustaqbal. Tim kami akan segera menghubungi Anda melalui
              WhatsApp untuk proses selanjutnya.
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Daftar Lagi
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Pendaftaran Siswa Baru
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Isi formulir di bawah ini untuk mendaftar sebagai siswa baru SMK Mustaqbal. Pastikan semua data
            yang Anda masukkan benar dan lengkap.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">Data Siswa</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="full_name">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    {...register('full_name')}
                    className="mt-1"
                    placeholder="Nama lengkap sesuai ijazah"
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="mt-1"
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">
                    No. Telepon <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="mt-1"
                    placeholder="08123456789"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <Label htmlFor="whatsapp">
                    No. WhatsApp <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    {...register('whatsapp')}
                    className="mt-1"
                    placeholder="08123456789"
                  />
                  {errors.whatsapp && (
                    <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="origin_school">
                    Asal Sekolah <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="origin_school"
                    {...register('origin_school')}
                    className="mt-1"
                    placeholder="SMP N 1 Bekasi"
                  />
                  {errors.origin_school && (
                    <p className="text-red-500 text-sm mt-1">{errors.origin_school.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="chosen_program">Program Keahlian yang Diminati</Label>
                  <Select onValueChange={(value) => setValue('chosen_program', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih program keahlian" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.title}>
                          {program.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Textarea
                    id="address"
                    {...register('address')}
                    className="mt-1"
                    placeholder="Alamat lengkap tempat tinggal"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">Data Orang Tua/Wali</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="parent_name">Nama Orang Tua/Wali</Label>
                  <Input
                    id="parent_name"
                    {...register('parent_name')}
                    className="mt-1"
                    placeholder="Nama lengkap orang tua"
                  />
                </div>

                <div>
                  <Label htmlFor="parent_phone">No. Telepon Orang Tua/Wali</Label>
                  <Input
                    id="parent_phone"
                    type="tel"
                    {...register('parent_phone')}
                    className="mt-1"
                    placeholder="08123456789"
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-slate-700">
                <span className="font-bold">Catatan:</span> Pastikan nomor WhatsApp yang Anda masukkan aktif.
                Tim kami akan menghubungi Anda melalui WhatsApp untuk proses selanjutnya.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg rounded-xl shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim Pendaftaran'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
